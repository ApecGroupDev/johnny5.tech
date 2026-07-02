import { NextRequest, NextResponse } from "next/server";

// Ruby Queen — /api/ruby-queen/fixes  (Next.js App Router)  [v3.2]
// SERVER-SIDE store for tech fix submissions + manager review, so the review queue
// and approved library entries are SHARED across every device — no longer stuck in
// one browser's localStorage. Storage = Vercel KV (Upstash Redis REST), the same
// KV the leaderboard uses (KV_REST_API_URL + KV_REST_API_TOKEN are auto-injected
// when KV is connected in the Vercel dashboard). No KV yet -> app falls back to
// per-browser localStorage and tells the user (stored:false).
//
// Redis layout:  HSET rq_fixes <id> <json>
//   json = {id, sys, symptom, found, fix, who, at, status, cleaned?, entry?, reason?, decidedAt?}
//   status: queued | approved | rejected | discarded

const KEYNAME = "rq_fixes";
const ADMIN_KEY = process.env.ADMIN_KEY || "Summerville";

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
  const d = await kv(["HGETALL", KEYNAME]);
  const flat = (d && d.result) || [];
  const out: any[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      out.push(JSON.parse(flat[i]));
    } catch (e) {}
  }
  return out;
}

async function readOne(id: string) {
  if (!kvReady()) return null;
  const d = await kv(["HGET", KEYNAME, String(id)]);
  if (!d || !d.result) return null;
  try {
    return JSON.parse(d.result);
  } catch (e) {
    return null;
  }
}

async function writeOne(fx: any) {
  await kv(["HSET", KEYNAME, String(fx.id), JSON.stringify(fx)]);
}

const S = (v: any, n: number) => String(v == null ? "" : v).slice(0, n);

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || "";

    // ?added=1 → approved library entries (public, feeds every browser at boot)
    if (url.searchParams.get("added")) {
      const all = await readAll();
      const entries = all
        .filter((f) => f.status === "approved" && f.entry)
        .map((f) => f.entry);
      return NextResponse.json(
        { ok: true, kv: kvReady(), count: entries.length, entries },
        { headers: corsHeaders }
      );
    }

    // ?queue=1&key=<mgr> → queued items, oldest first (manager key)
    if (url.searchParams.get("queue")) {
      if (key !== ADMIN_KEY) {
        return NextResponse.json({ error: "Wrong key." }, { status: 403, headers: corsHeaders });
      }
      const all = await readAll();
      const fixes = all
        .filter((f) => f.status === "queued")
        .sort((a, b) => (a.at || 0) - (b.at || 0));
      return NextResponse.json(
        { ok: true, kv: kvReady(), count: fixes.length, fixes },
        { headers: corsHeaders }
      );
    }

    // ?export=1&key=<mgr> → FULL dump of everything, for local backup/merge
    if (url.searchParams.get("export")) {
      if (key !== ADMIN_KEY) {
        return NextResponse.json({ error: "Wrong key." }, { status: 403, headers: corsHeaders });
      }
      const all = await readAll();
      all.sort((a, b) => (a.at || 0) - (b.at || 0));
      return new NextResponse(
        JSON.stringify({
          exportedAt: new Date().toISOString(),
          count: all.length,
          statuses: all.reduce((m: any, f: any) => {
            m[f.status] = (m[f.status] || 0) + 1;
            return m;
          }, {}),
          fixes: all,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Content-Disposition": 'attachment; filename="ruby_queen_fixes_backup.json"',
          },
        }
      );
    }

    // Default: health check
    return NextResponse.json(
      { ok: true, service: "ruby-queen-fixes", kv: kvReady() },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const op = b.op || "submit";

    if (op === "submit" || op === "discard") {
      if (!S(b.symptom, 4000).trim() && !S(b.fix, 4000).trim()) {
        return NextResponse.json({ error: "Empty submission." }, { status: 400, headers: corsHeaders });
      }
      const fx: any = {
        id: S(b.id, 40) || "F" + Date.now(),
        sys: S(b.sys, 120),
        symptom: S(b.symptom, 4000),
        found: S(b.found, 4000),
        fix: S(b.fix, 4000),
        who: S(b.who, 60),
        at: Number(b.at) || Date.now(),
        status: op === "discard" ? "discarded" : "queued",
        reason: S(b.reason, 300),
      };
      if (b.cleaned && typeof b.cleaned === "object") {
        fx.cleaned = {
          title: S(b.cleaned.title, 140),
          problem: S(b.cleaned.problem, 4000),
          solution: S(b.cleaned.solution, 4000),
          group: S(b.cleaned.group, 80),
        };
      }
      if (!kvReady()) {
        return NextResponse.json(
          { ok: false, stored: false, note: "KV storage not configured yet." },
          { headers: corsHeaders }
        );
      }
      await writeOne(fx);
      return NextResponse.json({ ok: true, stored: true, id: fx.id }, { headers: corsHeaders });
    }

    if (op === "approve" || op === "reject") {
      if ((b.key || "") !== ADMIN_KEY) {
        return NextResponse.json({ error: "Wrong key." }, { status: 403, headers: corsHeaders });
      }
      if (!kvReady()) {
        return NextResponse.json(
          { ok: false, stored: false, note: "KV storage not configured yet." },
          { headers: corsHeaders }
        );
      }
      const fx = await readOne(b.id);
      if (!fx) {
        return NextResponse.json(
          { error: "No such submission: " + S(b.id, 40) },
          { status: 404, headers: corsHeaders }
        );
      }
      fx.status = op === "approve" ? "approved" : "rejected";
      fx.decidedAt = Date.now();
      if (op === "reject") fx.reason = S(b.reason, 300) || "Rejected by manager.";
      if (op === "approve" && b.entry && typeof b.entry === "object") {
        fx.entry = {
          id: S(b.entry.id, 40),
          title: S(b.entry.title, 140),
          group: S(b.entry.group, 80),
          answer: S(b.entry.answer, 4000),
          problem: S(b.entry.problem, 4000),
          solution: S(b.entry.solution, 4000),
          keywords: S(b.entry.keywords, 300),
          source: S(b.entry.source, 120),
          table: "",
          trust: "apec",
        };
      }
      await writeOne(fx);
      return NextResponse.json(
        { ok: true, stored: true, id: fx.id, status: fx.status },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json({ error: "Unknown op." }, { status: 400, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500, headers: corsHeaders }
    );
  }
}
