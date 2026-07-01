import { NextResponse } from "next/server";

const KEYNAME = "rq_contrib";
const POINTS = { approve: 3, submit: 1 };

function kvReady() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kv(cmd: any) {
  const r = await fetch(process.env.KV_REST_API_URL!, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.KV_REST_API_TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) {
    throw new Error("KV " + r.status + ": " + (await r.text()).slice(0, 200));
  }
  return r.json();
}

async function readAll() {
  if (!kvReady()) return [];
  const d = await kv(["LRANGE", KEYNAME, "0", "-1"]);
  const list = (d && d.result) || [];
  return list
    .map((s: string) => {
      try {
        return JSON.parse(s);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
}

function sinceFor(period: string) {
  const day = 86400000;
  const now = Date.now();
  if (period === "week") return now - 7 * day;
  if (period === "month") return now - 30 * day;
  if (period === "quarter") return now - 90 * day;
  return 0; // all time
}

function leaderboard(events: any[], period: string) {
  const since = sinceFor(period);
  const by: any = {};
  for (const e of events) {
    if (!e || (e.at || 0) < since) continue;
    const name = (e.tech || "Unknown").trim() || "Unknown";
    const t = by[name] || (by[name] = { tech: name, submitted: 0, approved: 0, points: 0 });
    if (e.action === "approve") {
      t.approved++;
      t.points += POINTS.approve;
    } else {
      t.submitted++;
      t.points += POINTS.submit;
    }
  }
  const techs = Object.values(by).sort(
    (a: any, b: any) => b.points - a.points || b.approved - a.approved || a.tech.localeCompare(b.tech)
  );
  return {
    period,
    since,
    techs,
    totalEvents: events.filter((e) => e && (e.at || 0) >= since).length,
    points: POINTS,
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "all";
    const events = await readAll();
    
    if (url.searchParams.get("export")) {
      const ADMIN_KEY = process.env.ADMIN_KEY || "Summerville";
      if ((url.searchParams.get("key") || "") !== ADMIN_KEY) {
        return NextResponse.json({ error: "Wrong admin key." }, { status: 403 });
      }
      return NextResponse.json({
        exportedAt: new Date().toISOString(),
        count: events.length,
        events,
      });
    }
    return NextResponse.json(leaderboard(events, period));
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    if (b.op === "leaderboard") {
      const events = await readAll();
      return NextResponse.json(leaderboard(events, b.period || "all"));
    }
    const ev = {
      tech: String(b.tech || "Unknown").slice(0, 60),
      action: b.action === "approve" ? "approve" : "submit",
      title: String(b.title || "").slice(0, 140),
      id: String(b.id || ""),
      group: String(b.group || ""),
      at: Date.now(),
    };
    if (!kvReady()) {
      return NextResponse.json({ ok: false, stored: false, note: "KV storage not configured yet." });
    }
    await kv(["LPUSH", KEYNAME, JSON.stringify(ev)]);
    return NextResponse.json({ ok: true, stored: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
