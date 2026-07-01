const PEGGY =
  "data:image/jpeg;base64,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";
let KB = [],
  SITES = [],
  SERVICE = [],
  FIELDS = {},
  SVC_BY_SITE = {},
  GROUPS = [];
const SYSLIST = [
  "Commander",
  "Ruby2",
  "Topaz / Topaz 410",
  "Sapphire",
  "RubyCI",
  "Pinpad (MX915/M400/P400)",
  "Dispenser / DCR",
  "Network / Comms",
  "Back office / Reports",
  "Other",
];
const CAT_ORDER = [
  "IDENTITY",
  "LOCATION",
  "CONTACTS",
  "IDs & NETWORK",
  "SOFTWARE",
  "EQUIPMENT SERIALS",
  "DISPENSERS / TANKS / IMAGING",
  "INSTALL & CONTRACT",
  "STATUS / TRACKING",
  "OPERATIONS",
  "SERVICE HISTORY",
  "SOURCE",
];
const SENS =
  /PASS|PWD|SECRET|ANSWER|SECURITY|GEMKEY|DEBIT_KEY|TUNNEL_IP|GATEWAY_IP|WAN_IP/i;
const LS = {
  get gw() {
    return localStorage.getItem("rq_gw") || "";
  },
  set gw(v) {
    localStorage.setItem("rq_gw", v);
  },
  get role() {
    return localStorage.getItem("rq_role") || "tech";
  },
  set role(v) {
    localStorage.setItem("rq_role", v);
  },
  get queue() {
    return JSON.parse(localStorage.getItem("rq_queue") || "[]");
  },
  set queue(v) {
    localStorage.setItem("rq_queue", JSON.stringify(v));
  },
  get discard() {
    return JSON.parse(localStorage.getItem("rq_discard") || "[]");
  },
  set discard(v) {
    localStorage.setItem("rq_discard", JSON.stringify(v));
  },
  get added() {
    return JSON.parse(localStorage.getItem("rq_added") || "[]");
  },
  set added(v) {
    localStorage.setItem("rq_added", JSON.stringify(v));
  },
  get tech() {
    return localStorage.getItem("rq_tech") || "";
  },
  set tech(v) {
    localStorage.setItem("rq_tech", v);
  },
};
let history = [];
let lastQ = "";
let lbPeriod = "all";
function gatewayBase() {
  if (LS.gw) return LS.gw.replace(/\/$/, "");
  if (location.protocol === "http:" || location.protocol === "https:")
    return "";
  return null;
}
function liveMode() {
  return gatewayBase() !== null;
}
function esc(s) {
  return (s == null ? "" : String(s)).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}
function val(id) {
  return document.getElementById(id).value.trim();
}

async function boot() {
  try {
    const [kb, sites, svc, fl] = await Promise.all([
      fetch("data/kb.json").then((r) => r.json()),
      fetch("data/sites.json").then((r) => r.json()),
      fetch("data/service.json").then((r) => r.json()),
      fetch("data/field_labels.json").then((r) => r.json()),
    ]);
    KB = kb.entries || kb;
    GROUPS = kb.groups || [];
    SITES = sites;
    SERVICE = svc;
    FIELDS = fl;
    SERVICE.forEach((r, i) => (r._i = i));
    for (const a of LS.added) {
      if (!KB.find((e) => e.id === a.id)) KB.push(a);
    }
    SVC_BY_SITE = {};
    SERVICE.forEach((r) => {
      if (r.site_id != null) {
        (SVC_BY_SITE[r.site_id] = SVC_BY_SITE[r.site_id] || []).push(r);
      }
    });
    document.getElementById("loading").classList.add("hidden");
    SYSLIST.forEach((s) => {
      const o = document.createElement("option");
      o.textContent = s;
      document.getElementById("f_sys").appendChild(o);
    });
    setRole("tech", true);
    refreshMode();
    greet();
    document.getElementById("f_who").value = LS.tech;
    renderQueueBadge();
    buildBrowse();
    sitesHome();
    histHome();
    window.KB = KB;
    window.SITES = SITES;
    window.SERVICE = SERVICE;
    window.SVC_BY_SITE = SVC_BY_SITE;
    window.FIELDS = FIELDS;
    showTab("ask");
  } catch (e) {
    document.getElementById("loading").outerHTML =
      '<div class="loaderr"><b>Could not load the data files.</b><br>Run this from a server — <code>vercel dev</code> on your machine, or the hosted site — not by double-clicking the file. (' +
      esc(String(e)) +
      ")</div>";
  }
}
function refreshMode() {
  const live = liveMode();
  const t = document.getElementById("modeTag");
  t.textContent = live ? "Live mode" : "Demo mode";
  t.className = "mode " + (live ? "live" : "demo");
}
function setRole(r, silent) {
  LS.role = r;
  document.getElementById("roleTech").classList.toggle("on", r === "tech");
  document.getElementById("roleMgr").classList.toggle("on", r === "manager");
  document
    .querySelectorAll(".mgronly")
    .forEach((el) => el.classList.toggle("hidden", r !== "manager"));
}
function showTab(t) {
  for (const [tab, pane] of [
    ["Ask", "Ask"],
    ["Sites", "Sites"],
    ["Hist", "Hist"],
    ["Log", "Log"],
    ["Review", "Review"],
    ["Leader", "Leader"],
    ["Browse", "Browse"],
  ]) {
    document
      .getElementById("tab" + tab)
      .classList.toggle(
        "on",
        tab.toLowerCase() === t.toLowerCase() ||
          (tab === "Hist" && t === "hist"),
      );
    document
      .getElementById("pane" + pane)
      .classList.toggle(
        "hidden",
        pane.toLowerCase() !== t.toLowerCase() &&
          !(pane === "Hist" && t === "hist"),
      );
  }
  if (t === "review") renderQueue();
  if (t === "leader") loadLeader(lbPeriod);
}
/* ---------- retrieval ---------- */
const STOP = new Set(
  "the a an of to is in on at it and or for with my our we i you your this that not no get got keeps stuck only after before when how what why who does did do done can could would should will please help need want make made me now thing things working work but if then so very really just been being have has had".split(
    " ",
  ),
);
const isCode = (w) => /^[a-z]?\d{1,6}$/.test(w);
function tokens(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((w) => isCode(w) || (w.length > 2 && !STOP.has(w)));
}
function kbScore(e, qt) {
  const hay = (
    e.title +
    " " +
    e.keywords +
    " " +
    e.problem +
    " " +
    e.answer +
    " " +
    e.group +
    " " +
    (e.table || "")
  ).toLowerCase();
  const ttl = (e.title + " " + e.keywords).toLowerCase();
  let s = 0,
    strong = false;
  for (const w of qt) {
    const b = new RegExp(
      "\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
    );
    const c = /^[a-z]?\d{2,5}$/.test(w);
    if (b.test(ttl)) {
      s += 3;
      strong = true;
    } else if (b.test(hay)) {
      s += 1;
    }
    if (c && b.test(hay)) {
      s += 4;
      strong = true;
    }
  }
  return { s, strong };
}
function kbFind(q, n = 4) {
  const qt = tokens(q);
  if (!qt.length) return [];
  return KB.map((e) => {
    const r = kbScore(e, qt);
    return { e, s: r.s, strong: r.strong };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n);
}
function svcFind(q, n = 40, invOnly) {
  const qt = tokens(q);
  if (!qt.length) return [];
  const SRC = invOnly ? SERVICE.filter((r) => r.source === "Invoice") : SERVICE;
  return SRC.map((r) => {
    const hay = (
      r.problem +
      " " +
      r.solution +
      " " +
      r.site +
      " " +
      r.tech +
      " " +
      r.equipment +
      " " +
      r.brand
    ).toLowerCase();
    let s = 0;
    for (const w of qt) {
      if (hay.includes(w)) s += 1;
    }
    return { r, s };
  })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.r);
}
function siteFind(q, n = 40) {
  const qt = tokens(q);
  if (!qt.length) return [];
  return SITES.map((s) => {
    const nm = ((s.NAME || "") + " " + (s.BRAND || "")).toLowerCase();
    const hay =
      nm +
      " " +
      (
        (s.CITY || "") +
        " " +
        (s.STATE || "") +
        " " +
        (s.ADDRESS || "") +
        " " +
        (s.OPERATOR || "") +
        " " +
        (s.SERVICE_ID || "") +
        " " +
        (s.JOBBER || "")
      ).toLowerCase();
    let sc = 0;
    for (const w of qt) {
      const b = new RegExp(
        "\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
      );
      if (b.test(nm)) sc += 3;
      else if (hay.includes(w)) sc += 1;
    }
    return { s, sc };
  })
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc)
    .slice(0, n)
    .map((x) => x.s);
}
/* ---------- ASK ---------- */
function renderSuggest() {
  const ex = [
    "Pump stuck on BLUE at $0.00",
    "EID reads all zeroes",
    "Apple Pay not working",
    "EPS Comm Offline won't clear",
    "What does E9040 mean?",
    "SPM breached / KSB error",
  ];
  document.getElementById("suggest").innerHTML = ex
    .map(
      (x) =>
        `<button onclick="askText('${x.replace(/'/g, "\\'")}')">${x}</button>`,
    )
    .join("");
}
function askText(t) {
  document.getElementById("q").value = t;
  ask();
}
function greet() {
  document.getElementById("greet").innerHTML =
    "<b>Hi — I'm Ruby Queen</b>, what can I help solve for you today?";
}
function ask() {
  const q = document.getElementById("q").value.trim();
  if (!q) return;
  lastQ = q;
  document.getElementById("q").value = "";
  addUser(q);
  history.push({ role: "user", content: q });
  const hits = kbFind(q);
  if (liveMode()) liveAnswer(q, hits);
  else demoAnswer(q, hits);
}
function relatedSvc(q) {
  const sv = svcFind(q, 3);
  if (!sv.length) return "";
  return (
    `<div class="cites"><b>Related past service calls:</b><br>` +
    sv
      .map(
        (r) =>
          `<a class="lnk" onclick="openSvc('${r.source}','${esc(r.ticket)}')">${tagFor(r)} ${esc(r.site)} — ${esc((r.problem || "").slice(0, 70))}</a>`,
      )
      .join("<br>") +
    `</div>`
  );
}
function demoAnswer(q, hits) {
  if (hits.length && hits[0].strong && hits[0].s >= 4) {
    const e = hits[0].e;
    const body = e.answer || e.solution || e.problem || "See the entry.";
    const cite = hits
      .slice(0, 3)
      .map(
        (h) =>
          `<a class="lnk" onclick="openEntry('${h.e.id}')">#${h.e.id} ${esc(h.e.title)}</a>`,
      )
      .join("<br>");
    addBot({
      label: "lib",
      html: `${esc(body)}`,
      cites: `<b>From the library:</b><br>${cite}` + relatedSvc(q),
    });
  } else {
    addBot({
      label: "none",
      html:
        `<b>That one isn't in Ruby Queen's library yet.</b> In Live mode I'd search the web and label it <span class="tag web">From the web</span>. For now, try the <b>Service History</b> tab for past calls, or different words.` +
        relatedSvc(q),
    });
  }
}
async function liveAnswer(q, hits) {
  const wait = addBot({ label: "none", html: "<i>Thinking…</i>", temp: 1 });
  try {
    const ctx = hits.map((h) => ({
      id: h.e.id,
      title: h.e.title,
      answer: h.e.answer,
      problem: h.e.problem,
      solution: h.e.solution,
    }));
    const svc = svcFind(q, 5).map((r) => ({
      source: r.source,
      site: r.site,
      problem: r.problem,
      solution: r.solution,
    }));
    const r = await fetch(gatewayBase() + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: q,
        history: history.slice(-8),
        context: ctx,
        service: svc,
      }),
    });
    const d = await r.json();
    wait.remove();
    const src =
      d.source === "library" ? "lib" : d.source === "web" ? "web" : "none";
    const cites =
      d.entries && d.entries.length
        ? "<b>From the library:</b><br>" +
          d.entries
            .map((id) => {
              const e = KB.find((x) => x.id == id);
              return e
                ? `<a class="lnk" onclick="openEntry('${id}')">#${id} ${esc(e.title)}</a>`
                : "#" + id;
            })
            .join("<br>")
        : "";
    addBot({
      label: src,
      html: esc(d.answer || "No answer.").replace(/\n/g, "<br>"),
      cites: cites + relatedSvc(q) + webBtn(src),
    });
    history.push({
      role: "assistant",
      content: (d.answer || "").slice(0, 1000),
    });
  } catch (err) {
    wait.remove();
    addBot({
      label: "none",
      html:
        "<b>Could not reach the gateway.</b> " +
        esc(String(err.message || err)),
    });
  }
}
function addUser(t) {
  const c = document.getElementById("chat");
  c.insertAdjacentHTML(
    "beforeend",
    `<div class="msg"><div class="av u">You</div><div class="bubble"><div class="who">Technician</div><div class="ans">${esc(t)}</div></div></div>`,
  );
  c.scrollTop = c.scrollHeight;
}
function addBot({ html, label, cites, temp }) {
  const c = document.getElementById("chat");
  const lab = label
    ? `<span class="label ${label}">${label === "lib" ? "APEC Verified — From the library" : label === "web" ? "From the web — verify with care" : "Ruby Queen"}</span>`
    : "";
  const w = document.createElement("div");
  w.className = "msg";
  w.innerHTML = `<div class="av b"><img src="${PEGGY}"></div><div class="bubble"><div class="who">Ruby Queen</div>${lab}<div class="ans">${html}${cites ? `<div class="cites">${cites}</div>` : ""}</div></div>`;
  c.appendChild(w);
  c.scrollTop = c.scrollHeight;
  return w;
}
/* ---------- SITES ---------- */
function tagFor(r) {
  return r.source === "Invoice"
    ? '<span class="tag inv">Invoice</span>'
    : '<span class="tag log">Site log</span>';
}
function sitesHome() {
  const brands = {};
  SITES.forEach((s) => {
    const b = (s.BRAND || "?").trim() || "?";
    brands[b] = (brands[b] || 0) + 1;
  });
  const top = Object.entries(brands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  document.getElementById("sitesTop").innerHTML =
    `<div class="kpi"><div class="b"><div class="n">${SITES.length.toLocaleString()}</div><div class="l">site profiles</div></div>${top.map(([b, n]) => `<div class="b"><div class="n">${n}</div><div class="l">${esc(b)}</div></div>`).join("")}</div><p class="small">Search a site to see its equipment, software, network, access and full service history.</p>`;
}
function runSites() {
  const q = val("sq");
  const res = siteFind(q);
  const host = document.getElementById("sitesBody");
  if (!q) {
    host.innerHTML = "";
    return;
  }
  host.innerHTML = res.length
    ? res
        .map(
          (s) =>
            `<div class="hit" onclick="openSite('${s._id}')"><div class="t">${esc(s.NAME || "(unnamed site)")} ${s.BRAND ? `<span class="tag br">${esc(s.BRAND)}</span>` : ""}</div><div class="m">${esc([s.CITY, s.STATE].filter(Boolean).join(", "))} ${s.SERVICE_ID ? "· Service ID " + esc(s.SERVICE_ID) : ""} · ${(SVC_BY_SITE[s._id] || []).length} service calls</div><div class="d">${esc(s.ADDRESS || "")}</div></div>`,
        )
        .join("")
    : '<p class="small">No matching sites.</p>';
}
function openSite(id) {
  const s = SITES.find((x) => String(x._id) === String(id));
  if (!s) return;
  showTab("sites");
  const cats = {};
  for (const [k, v] of Object.entries(s)) {
    if (k.startsWith("_") || k === "NOTES") continue;
    if (v == null || v === "") continue;
    const meta = FIELDS[k] || { label: k, cat: "OTHER" };
    (cats[meta.cat] = cats[meta.cat] || []).push([meta.label, String(v), k]);
  }
  let html = `<div class="card"><button class="btn ghost" onclick="runSites()">← Back to results</button><h2 style="margin:10px 0 2px">${esc(s.NAME || "(unnamed)")} ${s.BRAND ? `<span class="tag br">${esc(s.BRAND)}</span>` : ""}</h2><div class="small">${esc([s.ADDRESS, s.CITY, s.STATE, s.ZIP].filter(Boolean).join(", "))}</div>`;
  if (s.NOTES)
    html += `<div class="notebox" style="margin-top:10px">📝 <b>Note:</b> ${esc(s.NOTES)}</div>`;
  /* item 12: inner-circle only — access fields shown without masking */
  const ordered = CAT_ORDER.filter((c) => cats[c]).concat(
    Object.keys(cats).filter((c) => !CAT_ORDER.includes(c)),
  );
  for (const c of ordered) {
    html +=
      `<div class="grp">${esc(c)}</div><div class="kvs">` +
      cats[c]
        .map(
          ([l, v, k]) =>
            `<div class="k">${esc(l)}</div><div class="v">${esc(v)}</div>`,
        )
        .join("") +
      `</div>`;
  }
  html += `</div>`;
  const sv = (SVC_BY_SITE[s._id] || [])
    .slice()
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));
  html +=
    `<div class="card"><h3 style="margin:0 0 8px;color:var(--red)">Service history at this site (${sv.length})</h3>` +
    (sv.length
      ? sv.map((r) => svcRow(r)).join("")
      : '<p class="small">No linked service calls.</p>') +
    `</div>`;
  document.getElementById("sitesBody").innerHTML = html;
  window.scrollTo(0, 0);
}
/* ---------- SERVICE HISTORY ---------- */
function histHome() {
  const inv = SERVICE.filter((r) => r.source === "Invoice").length;
  document.getElementById("histTop").innerHTML =
    `<div class="kpi"><div class="b"><div class="n">${inv.toLocaleString()}</div><div class="l">service invoices (with fixes)</div></div></div><p class="small">Search resolved service invoices — problem, fix and parts. Click any result to open the full ticket. (Brief site logs live under each site's own profile.)</p>`;
}
function svcRow(r) {
  const sol = r.solution
    ? `<div class="d"><b>Fix:</b> ${esc(r.solution)}</div>`
    : "";
  const parts = r.parts
    ? `<div class="small" style="margin-top:3px"><b>Parts:</b> ${esc(r.parts)}</div>`
    : "";
  return `<div class="hit" style="cursor:default"><div class="t">${tagFor(r)} ${esc(r.site || "")} ${r.brand ? `<span class="tag br">${esc(r.brand)}</span>` : ""}</div><div class="m">${esc([r.date, r.tech && "tech " + r.tech, r.equipment, r.ticket].filter(Boolean).join(" · "))}</div><div class="d"><b>Problem:</b> ${esc(r.problem || "(not stated)")}</div>${sol}${parts}</div>`;
}
function runHist() {
  const q = val("hq");
  const host = document.getElementById("histBody");
  if (!q) {
    host.innerHTML = "";
    return;
  }
  const res = svcFind(q, 80, true).sort(
    (a, b) => parseDate(b.date) - parseDate(a.date),
  );
  host.innerHTML = res.length
    ? `<p class="small">${res.length} matching invoices — click any ticket for the full fix</p>` +
      res.map(svcSummaryRow).join("")
    : '<p class="small">No matching service invoices.</p>';
}
function openSvc(source, ticket) {
  const r = SERVICE.find(
    (x) => x.source === source && String(x.ticket) === String(ticket),
  );
  if (r) {
    showTab("hist");
    openSvcDetail(r._i);
  }
}
/* ---------- LOG A FIX (manager review) ---------- */
const JUNK =
  /\b(hammer|kick(ed)?|hit it|punch|smack|whack|cuss|cussed|swore|swear|pray(ed|er)?|magic|voodoo|gremlin|ghost|yell(ed)?|banged?)\b/i;
function submitFix() {
  const sym = val("f_sym"),
    fix = val("f_fix"),
    who = val("f_who") || "Unknown tech",
    sys = val("f_sys"),
    found = val("f_found");
  const msg = document.getElementById("logMsg");
  if (sym.length < 4 || fix.length < 3) {
    msg.textContent = "Please describe the symptom and the fix.";
    msg.style.color = "var(--red)";
    return;
  }
  const blob = sym + " " + found + " " + fix;
  const res = document.getElementById("logResult");
  const sub = {
    id: "F" + Date.now(),
    sys,
    symptom: sym,
    found,
    fix,
    who,
    at: new Date().toISOString(),
  };
  if (JUNK.test(blob)) {
    const d = LS.discard;
    d.unshift({
      ...sub,
      reason:
        "Mentions a non-technical / anecdotal fix. Held for audit, not sent to the manager.",
    });
    LS.discard = d;
    res.innerHTML = `<div class="card"><div class="note">⚠ <b>Not added.</b> That reads as an anecdotal fix. Nothing is deleted — it's logged in the discard bin.</div></div>`;
    msg.textContent = "";
    return;
  }
  const item = {
    ...sub,
    cleaned: {
      title: sym.slice(0, 70),
      problem: sym,
      solution: fix,
      group: "Hardware & Terminals",
    },
    note: "Coherent, on-topic.",
  };
  const Q = LS.queue;
  Q.unshift(item);
  LS.queue = Q;
  LS.tech = who;
  logContrib("submit", who, item.cleaned.title, item.id);
  res.innerHTML = `<div class="card"><div class="note ok">✓ <b>Sent to the review queue.</b> A manager will approve it before it joins the library. Thanks, ${esc(who)}.</div></div>`;
  ["f_sym", "f_found", "f_fix"].forEach(
    (i) => (document.getElementById(i).value = ""),
  );
  renderQueueBadge();
  msg.textContent = "";
}
function renderQueueBadge() {
  const n = LS.queue.length,
    b = document.getElementById("qBadge");
  b.textContent = n;
  b.classList.toggle("hidden", n === 0);
}
function renderQueue() {
  const q = LS.queue,
    host = document.getElementById("queue");
  host.innerHTML = q.length ? "" : '<p class="small">Nothing waiting.</p>';
  q.forEach((it, i) => {
    const c = it.cleaned || {};
    host.insertAdjacentHTML(
      "beforeend",
      `<div class="hit" style="cursor:default"><div class="t">${esc(c.title || it.symptom)}</div><div class="m">${esc(it.sys)} · ${esc(it.who)} · ${new Date(it.at).toLocaleString()}</div><div class="d"><b>Symptom:</b> ${esc(it.symptom)}</div><div class="d"><b>Fix:</b> ${esc(c.solution || it.fix)}</div><div class="row" style="margin-top:8px"><button class="btn green" onclick="approve(${i})">Approve → library</button><button class="btn slate" onclick="rejectQ(${i})">Reject</button></div></div>`,
    );
  });
  renderDiscard();
}
function approve(i) {
  const q = LS.queue,
    it = q[i];
  if (!it) return;
  const c = it.cleaned || {};
  const e = {
    id: "A" + it.id.replace(/\D/g, "").slice(-6),
    title: c.title,
    group: c.group || "Hardware & Terminals",
    answer: c.solution,
    problem: it.symptom,
    solution: c.solution,
    keywords: it.sys,
    source: "Tech submission " + it.id,
    table: "",
    trust: "apec",
  };
  KB.push(e);
  const a = LS.added;
  a.push(e);
  LS.added = a;
  logContrib("approve", it.who, e.title, it.id);
  q.splice(i, 1);
  LS.queue = q;
  renderQueue();
  renderQueueBadge();
  buildBrowse();
  alert('Approved. "' + e.title + '" is now in the library.');
}
function rejectQ(i) {
  const q = LS.queue,
    it = q[i];
  if (!it) return;
  const d = LS.discard;
  d.unshift({ ...it, reason: "Rejected by manager." });
  LS.discard = d;
  q.splice(i, 1);
  LS.queue = q;
  renderQueue();
}
function renderDiscard() {
  const d = LS.discard,
    host = document.getElementById("discard");
  host.innerHTML = d.length ? "" : '<p class="small">Empty.</p>';
  d.slice(0, 30).forEach((it) =>
    host.insertAdjacentHTML(
      "beforeend",
      `<div class="hit" style="cursor:default;opacity:.75"><div class="t">${esc(it.symptom || "—")}</div><div class="note">${esc(it.reason || "")}</div></div>`,
    ),
  );
}
/* ---------- BROWSE ---------- */
function buildBrowse() {
  const g = {};
  KB.forEach((e) => {
    const k = e.group || "Other";
    g[k] = (g[k] || 0) + 1;
  });
  const cards = Object.entries(g)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([k, n]) =>
        `<div class="hit" onclick="openGroup('${esc(k)}')"><div class="t" style="color:var(--red);font-size:22px">${n}</div><div class="d">${esc(k)}</div></div>`,
    )
    .join("");
  document.getElementById("browseTop").innerHTML =
    `<div class="card"><h3 style="margin:0 0 4px;color:var(--red)">Browse the library</h3><p class="small" style="margin:0 0 10px">${KB.length} troubleshooting entries.</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:9px">${cards}</div></div>`;
  document.getElementById("browseBody").innerHTML = "";
}
function openGroup(g) {
  const list = KB.filter((e) => (e.group || "Other") === g);
  document.getElementById("browseBody").innerHTML =
    `<div class="card"><h3 style="margin:0 0 8px">${esc(g)} <span class="small">(${list.length})</span></h3>${list.map((e) => `<div class="hit" onclick="openEntry('${e.id}')"><div class="t">#${esc(e.id)} — ${esc(e.title)}</div></div>`).join("")}</div>`;
  window.scrollTo(0, 0);
}
function openEntry(id) {
  const e = KB.find((x) => x.id == id);
  if (!e) return;
  showTab("browse");
  document.getElementById("browseBody").innerHTML =
    `<div class="card"><button class="btn ghost" onclick="buildBrowse()">← Library</button><h2 style="margin:10px 0 2px">#${esc(e.id)} — ${esc(e.title)}</h2><p class="small"><span class="tag apec">APEC Verified</span> ${esc(e.group || "")} ${e.source ? "· " + esc(e.source) : ""}</p>${e.answer ? `<div class="d" style="margin:6px 0"><b>Answer:</b> ${esc(e.answer)}</div>` : ""}${e.problem ? `<div class="d" style="margin:6px 0"><b>Problem:</b> ${esc(e.problem)}</div>` : ""}${e.solution && e.solution !== e.answer ? `<div class="d" style="margin:6px 0"><b>Solution:</b> ${esc(e.solution)}</div>` : ""}${e.keywords ? `<div class="small" style="margin:6px 0"><b>Keywords:</b> ${esc(e.keywords)}</div>` : ""}${e.table ? `<pre class="tbl">${esc(e.table)}</pre>` : ""}</div>`;
  window.scrollTo(0, 0);
}
/* ---------- settings ---------- */
function openSettings() {
  document.getElementById("s_gw").value = LS.gw;
  document.getElementById("settings").classList.remove("hidden");
  refreshGw();
}
function closeSettings() {
  document.getElementById("settings").classList.add("hidden");
}
function saveSettings() {
  LS.gw = val("s_gw");
  refreshMode();
  refreshGw();
}
function refreshGw() {
  document.getElementById("gwStatus").innerHTML = liveMode()
    ? '<span class="statusdot dot-live"></span>Live'
    : '<span class="statusdot dot-demo"></span>Demo';
}
async function testGateway() {
  const url = val("s_gw");
  const base = url
    ? url.replace(/\/$/, "")
    : location.protocol === "http:" || location.protocol === "https:"
      ? ""
      : null;
  const s = document.getElementById("gwStatus");
  if (base === null) {
    s.textContent = "Open from your site to test live mode.";
    return;
  }
  s.innerHTML = "Testing…";
  try {
    const r = await fetch(base + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "ping", context: [] }),
    });
    s.innerHTML = r.ok
      ? '<span class="statusdot dot-live"></span>Connected ✓'
      : "reached, error " + r.status;
  } catch (e) {
    s.innerHTML = "no response";
  }
}
function exportData() {
  const blob = new Blob(
    [
      JSON.stringify(
        { queue: LS.queue, added: LS.added, discard: LS.discard },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ruby_queen_submissions.json";
  a.click();
}
/* ---------- v2 additions (2026-06-30) ---------- */
function parseDate(s) {
  if (!s) return 0;
  const m = String(s).match(/(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})/);
  if (!m) return 0;
  let a = +m[1],
    b = +m[2],
    y = +m[3];
  if (y < 100) y += 2000;
  const t = new Date(y, a - 1, b).getTime();
  return isNaN(t) ? 0 : t;
}
function tryManager() {
  if (LS.role === "manager") {
    setRole("manager");
    return;
  }
  const p = prompt("Service Manager password:");
  if (p === null) {
    setRole("tech");
    return;
  }
  if (p === "Summerville") {
    setRole("manager");
  } else {
    setRole("tech");
    alert("Incorrect password.");
  }
}
function clearChat() {
  document.getElementById("chat").innerHTML = "";
  history = [];
}
function webBtn(src) {
  return liveMode() && (src === "lib" || src === "none")
    ? `<div class="webbtn"><button onclick="webAlso()">\u{1F310} Also search the web for this</button></div>`
    : "";
}
async function webAlso() {
  const q = lastQ;
  if (!q) return;
  if (!liveMode()) {
    addBot({ label: "none", html: "Web search runs on the live site." });
    return;
  }
  const wait = addBot({
    label: "none",
    html: "<i>Searching the web…</i>",
    temp: 1,
  });
  try {
    const r = await fetch(gatewayBase() + "/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, web: true }),
    });
    const d = await r.json();
    wait.remove();
    addBot({
      label: "web",
      html: esc(d.answer || "No web answer.").replace(/\n/g, "<br>"),
    });
  } catch (e) {
    wait.remove();
    addBot({
      label: "none",
      html: "Web search failed: " + esc(String(e.message || e)),
    });
  }
}
function logContrib(action, tech, title, id) {
  if (!liveMode()) return;
  try {
    fetch(gatewayBase() + "/api/contrib", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: action,
        tech: tech,
        title: title,
        id: id,
      }),
    }).catch(function () {});
  } catch (e) {}
}
function svcSummaryRow(r) {
  return `<div class="hit" onclick="openSvcDetail(${r._i})"><div class="t">${tagFor(r)} ${esc(r.site || "(site)")} ${r.brand ? `<span class="tag br">${esc(r.brand)}</span>` : ""}</div><div class="m">${esc([r.date, r.tech && "tech " + r.tech, r.equipment, r.ticket && "#" + r.ticket].filter(Boolean).join(" · "))}</div><div class="d">${esc(r.problem || "(not stated)")}</div></div>`;
}
function openSvcDetail(i) {
  const r = SERVICE[i];
  if (!r) return;
  showTab("hist");
  const rows = [
    ["Site", r.site],
    ["Brand", r.brand],
    ["Date", r.date],
    ["Ticket", r.ticket],
    ["Technician", r.tech],
    ["Equipment", r.equipment],
    ["Parts", r.parts],
  ].filter((x) => x[1]);
  document.getElementById("histBody").innerHTML =
    `<div class="card"><button class="btn ghost" onclick="runHist()">← Back to results</button><h3 style="margin:10px 0 8px;color:var(--red)">${tagFor(r)} ${esc(r.site || "Service call")}</h3><div class="kvs">` +
    rows
      .map(
        ([k, v]) =>
          `<div class="k">${esc(k)}</div><div class="v">${esc(String(v))}</div>`,
      )
      .join("") +
    `</div><div class="grp">Problem</div><div class="d">${esc(r.problem || "(not stated)")}</div>` +
    (r.solution
      ? `<div class="grp">Solution / fix</div><div class="d">${esc(r.solution)}</div>`
      : `<div class="note">No written solution was captured on this invoice.</div>`) +
    `</div>`;
  window.scrollTo(0, 0);
}
function renderPeriods() {
  const P = [
    ["week", "This week"],
    ["month", "This month"],
    ["quarter", "This quarter"],
    ["all", "All time"],
  ];
  document.getElementById("lbPeriods").innerHTML = P.map(
    ([k, l]) =>
      `<button class="${k === lbPeriod ? "on" : ""}" onclick="setPeriod('${k}')">${l}</button>`,
  ).join("");
}
function setPeriod(p) {
  lbPeriod = p;
  loadLeader(p);
}
async function loadLeader(p) {
  lbPeriod = p || lbPeriod;
  renderPeriods();
  const body = document.getElementById("lbBody");
  if (!liveMode()) {
    body.innerHTML =
      '<p class="small">The leaderboard runs on the live site (it reads the shared database).</p>';
    document.getElementById("lbNote").textContent = "";
    return;
  }
  body.innerHTML = '<p class="small">Loading…</p>';
  try {
    const r = await fetch(gatewayBase() + "/api/contrib", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "leaderboard", period: lbPeriod }),
    });
    const d = await r.json();
    const t = (d && d.techs) || [];
    if (!t.length) {
      body.innerHTML =
        '<p class="small">No contributions recorded yet for this period.</p>';
      document.getElementById("lbNote").textContent = "";
      return;
    }
    body.innerHTML = t
      .map((x, i) => {
        const cls = i === 0 ? "top1" : i === 1 ? "top2" : "";
        const medal = i === 0 ? "\u{1F947}" : i === 1 ? "\u{1F948}" : i + 1;
        return `<div class="lbrow ${cls}"><div class="rk">${medal}</div><div><div class="nm">${esc(x.tech)}</div><div class="sub">${x.approved} approved · ${x.submitted} submitted</div></div><div style="flex:1"></div><div class="pts">${x.points}<span class="sub"> pts</span></div></div>`;
      })
      .join("");
    document.getElementById("lbNote").textContent =
      "Points: approved fix = 3, submission = 1.";
  } catch (e) {
    body.innerHTML =
      '<p class="small">Could not load the leaderboard: ' +
      esc(String(e.message || e)) +
      "</p>";
  }
}
function exportLeader() {
  if (!liveMode()) {
    alert("Export runs on the live site.");
    return;
  }
  window.open(
    gatewayBase() + "/api/contrib?export=1&key=Summerville",
    "_blank",
  );
}
