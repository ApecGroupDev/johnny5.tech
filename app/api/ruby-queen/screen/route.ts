import { NextResponse } from "next/server";

const API = "https://api.anthropic.com/v1/messages";
const VER = "2023-06-01";

const SCOPE = `You are Ruby Queen, the POS service assistant for APEC Group's field technicians (Verifone/Ruby/Topaz/Sapphire/Commander, dispensers, pinpads, networks, card brands, reports). Stay strictly on POS/fuel/payment service work.`;

const pickJSON = (t: string | null) => {
  if (!t) return null;
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b < 0) return null;
  try {
    return JSON.parse(t.slice(a, b + 1));
  } catch (e) {
    return null;
  }
};

const textOf = (d: any) =>
  (d.content || [])
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join("\n")
    .trim();

async function callClaude(body: any) {
  const apiKey = process.env.RUBY_QUEEN_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": apiKey as string,
      "anthropic-version": VER,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    throw new Error("Anthropic " + r.status + ": " + (await r.text()).slice(0, 300));
  }
  return r.json();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.RUBY_QUEEN_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { verdict: "accept", reason: "Server missing key; sent to review unscreened.", cleaned: null },
      { status: 500 }
    );
  }

  try {
    const sub = await req.json().catch(() => ({}));
    const groups =
      "Fuel & Dispensers, Hardware & Terminals, Cards & Payment, Network & Comms, POS Configuration, Upgrades & Patches, Error Codes & Messages, Reports & Back Office, Reference / Process";
    
    const data = await callClaude({
      model: process.env.SCREEN_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system:
        SCOPE +
        `\n\nYou screen a technician's submitted fix BEFORE a service manager reviews it.
Decide if it is a coherent, on-topic POS / fuel service fix.
Reject anecdotal or non-technical "fixes" (hitting or kicking the machine, cussing, superstition, or vague "it just started working") — they waste the manager's time.
If it is real but too vague, ask ONE clarifying question. If good, clean it into a library entry.
Reply ONLY with JSON:
{"verdict":"accept|clarify|reject","reason":"short reason","clarifying_question":"one question or empty","cleaned":{"title":"short title","problem":"the symptom","solution":"the steps that fixed it","keywords":"comma list","group":"one of: ${groups}"}}`,
      messages: [{ role: "user", content: JSON.stringify(sub) }],
    });

    return NextResponse.json(
      pickJSON(textOf(data)) || { verdict: "accept", reason: "Screened.", clarifying_question: "", cleaned: null }
    );
  } catch (err: any) {
    return NextResponse.json(
      { verdict: "accept", reason: "Screen error, sent to review: " + String(err.message || err), cleaned: null },
      { status: 500 }
    );
  }
}
