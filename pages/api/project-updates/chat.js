const { getServerSession } = require('next-auth');
const { authOptions } = require('../../../lib/auth');
const DATA = require('./_data.json');
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
function portfolio() {
  return DATA.projects.map(p => `- ${p.name} (${p.company}, ${p.city || 'n/a'}) — status: ${p.status}`).join('\n');
}
module.exports = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) { res.status(401).json({ error: 'auth' }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const projectId = body.projectId;
  const question = String(body.question || '').slice(0, 2000);
  if (!question) { res.status(400).json({ error: 'No question provided' }); return; }
  const key = process.env.PROJECT_UPDATES_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(500).json({ error: 'Server not configured (API key missing)' }); return; }

  let context;
  if (projectId && DATA.cards[projectId]) {
    context = 'DATA FOR THE SELECTED PROJECT:\n\n' + DATA.cards[projectId];
  } else {
    context = 'No single project selected. Here is the portfolio (ask me to pick one for detail):\n' + portfolio();
  }
  const system = [
    "You are Project_Updates, an internal assistant for APEC and GEO (gas-station construction & imaging projects).",
    "Answer ONLY from the project data provided in the user message. Be concise, specific, and practical.",
    "If the data does not contain the answer, say so plainly and name the field/section that would hold it.",
    "All money is USD. 'Uncollected'/owed = Total Invoiced minus Total Payment Received.",
    "For progress questions, use the Scope of Work checklist (done vs not) and the latest Reporter updates (newest first), and state completion status.",
    "Never invent numbers, dates, names, or statuses.",
    "Format answers as short paragraphs and simple bullet points; do not use large markdown headers — keep it clean and scannable."
  ].join(' ');
  const userMsg = context + '\n\n---\nQuestion: ' + question;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages: [{ role: 'user', content: userMsg }] })
    });
    if (!r.ok) { const t = await r.text(); res.status(502).json({ error: 'Model error', detail: t.slice(0, 400) }); return; }
    const j = await r.json();
    const answer = (j.content && j.content[0] && j.content[0].text) || '(no answer returned)';
    res.status(200).json({ answer });
  } catch (e) {
    res.status(502).json({ error: 'Upstream failure', detail: String(e).slice(0, 200) });
  }
};
