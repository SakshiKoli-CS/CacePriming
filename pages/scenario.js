import { useState } from "react";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "no-store");
  return { props: {} };
}

const TIERS = [
  { range: "domain-1 → domain-25",  domains: 25, limit: 81, color: "#059669", bg: "#ecfdf5", label: "Full"    },
  { range: "domain-26 → domain-50", domains: 25, limit: 55, color: "#0891b2", bg: "#ecfeff", label: "Partial" },
  { range: "domain-51 → domain-75", domains: 25, limit: 30, color: "#d97706", bg: "#fffbeb", label: "Limited" },
];

const TOTAL_URLS    = 100;
const TOTAL_DOMAINS = 75;

function calcTier(tier) {
  const primed  = tier.domains * tier.limit;
  const skipped = tier.domains * (TOTAL_URLS - tier.limit);
  return { primed, skipped };
}

export default function Scenario() {
  const [testDomain, setTestDomain] = useState("domain-32");
  const [testPage,   setTestPage]   = useState(600);
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);

  const grandPrimed  = TIERS.reduce((s, t) => s + calcTier(t).primed,  0);
  const grandSkipped = TIERS.reduce((s, t) => s + calcTier(t).skipped, 0);
  const grandTotal   = grandPrimed + grandSkipped;

  async function runTest() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/test/page-${testPage}`, {
        headers: { "x-simulated-host": `${testDomain}.contentstackapps.com` },
      });
      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = { html: true }; }
      setResult({ status: res.status, body, cacheControl: res.headers.get("cache-control") });
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={s.h1}>404 Cache Priming Scenario</h1>
      <p style={s.lead}>
        Simulates a real customer setup: <strong>{TOTAL_DOMAINS} domains</strong> pointing to
        the same project with <strong>{TOTAL_URLS} URLs</strong> in <code style={s.code}>launch.json</code>,
        where some domains only serve a subset of those URLs. The edge function (middleware)
        returns <code style={s.code}>404</code> for URLs that don't exist on a given domain.
      </p>

      {/* Summary counters */}
      <div style={s.counters}>
        {[
          { label: "Total URLs",    value: TOTAL_URLS,                  color: "#374151" },
          { label: "Total Domains", value: TOTAL_DOMAINS,               color: "#374151" },
          { label: "Total Requests",value: grandTotal.toLocaleString(), color: "#374151" },
          { label: "200 Primed",    value: grandPrimed.toLocaleString(), color: "#059669" },
          { label: "404 Skipped",   value: grandSkipped.toLocaleString(),color: "#dc2626" },
        ].map(({ label, value, color }) => (
          <div key={label} style={s.counter}>
            <span style={{ ...s.counterNum, color }}>{value}</span>
            <span style={s.counterLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <h2 style={s.h2}>Domain tiers</h2>
      <div style={s.tiers}>
        {TIERS.map((tier) => {
          const { primed, skipped } = calcTier(tier);
          const pct = Math.round((primed / (primed + skipped)) * 100);
          return (
            <div key={tier.range} style={s.tierCard}>
              <div style={s.tierTop}>
                <span style={{ ...s.tierBadge, color: tier.color, background: tier.bg }}>{tier.label}</span>
                <code style={s.tierRange}>{tier.range}</code>
              </div>
              <p style={s.tierStat}>
                Pages available: <strong>1 – {tier.limit}</strong> &nbsp;|&nbsp;
                Domains: <strong>{tier.domains}</strong>
              </p>
              <div style={s.barTrack}>
                <div style={{ ...s.barFill, width: `${pct}%`, background: tier.color }} />
              </div>
              <div style={s.tierNums}>
                <span style={{ color: "#059669" }}>✓ {primed.toLocaleString()} primed</span>
                <span style={{ color: "#dc2626" }}>✗ {skipped.toLocaleString()} 404</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edge function files */}
      <h2 style={s.h2}>Edge function files</h2>
      <div style={s.fileCard}>
        <div style={s.fileHeader}>
          <span style={s.fileBadge}>Contentstack Launch</span>
          <code style={s.fileName}>functions/[proxy].edge.js</code>
        </div>
        <p style={s.fileDesc}>
          Runs at the CDN edge on every request before it hits the origin.
          Uses the standard WinterCG Fetch API — no Next.js or Node.js APIs.
          404 responses are returned directly from the edge with <code style={s.code}>Cache-Control: no-store</code>,
          so the origin is never hit for unavailable pages.
        </p>
      </div>

      <pre style={s.pre}>{`// functions/[proxy].edge.js — tier logic
// launch.json has /test/page-1 → /test/page-81  (81 test pages)

Tier 1  domain-1  → domain-25  :  pages 1–81   →  200  (all available, pass through)
Tier 2  domain-26 → domain-50  :  pages 1–55   →  200  (pass through)
                                  pages 56–81   →  404  (blocked at edge, no origin hit)
Tier 3  domain-51 → domain-75  :  pages 1–30   →  200  (pass through)
                                  pages 31–81   →  404  (blocked at edge, no origin hit)

404 response headers:
  Cache-Control: no-store          ← CDN will not cache the 404
  x-cache-prime-skip: true         ← identifiable in Launch server logs`}</pre>

      {/* Live tester */}
      <h2 style={s.h2}>Live tester</h2>
      <p style={s.sub}>
        Simulate a cache priming request from a specific domain to a specific page.
        Uses <code style={s.code}>x-simulated-host</code> header to trigger the edge function locally.
      </p>
      <div style={s.tester}>
        <div style={s.testerInputs}>
          <label style={s.label}>
            Domain
            <div style={s.inputRow}>
              <input
                style={s.input}
                value={testDomain}
                onChange={(e) => setTestDomain(e.target.value)}
                placeholder="domain-32"
              />
              <span style={s.inputSuffix}>.contentstackapps.com</span>
            </div>
          </label>
          <label style={s.label}>
            Page number
            <input
              style={s.input}
              type="number"
              min={1}
              max={1000}
              value={testPage}
              onChange={(e) => setTestPage(Number(e.target.value))}
            />
          </label>
          <button
            style={{ ...s.btn, ...(loading ? s.btnOff : {}) }}
            onClick={runTest}
            disabled={loading}
          >
            {loading ? "Testing…" : "▶ Test request"}
          </button>
        </div>

        {result && (
          <div style={{ ...s.resultBox, borderColor: result.status === 200 ? "#6ee7b7" : "#fca5a5" }}>
            <div style={s.resultTop}>
              <span style={{
                ...s.statusBadge,
                background: result.status === 200 ? "#ecfdf5" : "#fef2f2",
                color:      result.status === 200 ? "#059669" : "#dc2626",
              }}>
                {result.status ?? "Error"}
              </span>
              <code style={s.resultUrl}>
                GET /test/page-{testPage} (as {testDomain}.contentstackapps.com)
              </code>
            </div>
            {result.cacheControl && (
              <code style={s.resultHeader}>Cache-Control: {result.cacheControl}</code>
            )}
            {result.status === 404 && result.body?.reason && (
              <p style={s.resultReason}>{result.body.reason}</p>
            )}
            {result.status === 200 && (
              <p style={s.resultReason}>Page exists on this domain — CDN will cache it.</p>
            )}
            {result.error && <p style={s.resultReason}>{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  code: { fontFamily: "monospace", fontSize: "0.88em", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  sub:  { fontSize: "0.82rem", color: "#9ca3af", margin: "0 0 12px" },

  counters: { display: "flex", gap: 16, flexWrap: "wrap", margin: "1.5rem 0" },
  counter:  { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 110 },
  counterNum:   { fontSize: "1.5rem", fontWeight: 800, lineHeight: 1 },
  counterLabel: { fontSize: "0.7rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" },

  h2:  { fontSize: "1rem", fontWeight: 700, margin: "2rem 0 0.75rem", color: "#111827" },

  fileCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 16 },
  fileHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  fileBadge: { padding: "2px 8px", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700, background: "#ecfdf5", color: "#059669" },
  fileName: { fontFamily: "monospace", fontSize: "0.8rem", color: "#374151" },
  fileDesc: { fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.6, margin: 0 },
  tiers: { display: "flex", flexDirection: "column", gap: 10 },
  tierCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1rem 1.25rem" },
  tierTop:  { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  tierBadge:{ padding: "2px 8px", borderRadius: 9999, fontSize: "0.72rem", fontWeight: 700 },
  tierRange:{ fontFamily: "monospace", fontSize: "0.8rem", color: "#374151" },
  tierStat: { fontSize: "0.82rem", color: "#6b7280", marginBottom: 8 },
  barTrack: { height: 6, background: "#f3f4f6", borderRadius: 9999, overflow: "hidden", marginBottom: 6 },
  barFill:  { height: "100%", borderRadius: 9999 },
  tierNums: { display: "flex", gap: 16, fontSize: "0.78rem", fontWeight: 600 },

  pre: {
    background: "#1e1e2e", color: "#cdd6f4", padding: "1.25rem",
    borderRadius: 10, fontSize: "0.78rem", lineHeight: 1.8,
    overflowX: "auto", marginBottom: 0,
  },

  tester: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 14 },
  testerInputs: { display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" },
  label: { display: "flex", flexDirection: "column", gap: 5, fontSize: "0.78rem", fontWeight: 600, color: "#374151" },
  inputRow: { display: "flex", alignItems: "center" },
  input: { padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: "0.875rem", outline: "none", fontFamily: "inherit", width: 120 },
  inputSuffix: { fontSize: "0.78rem", color: "#9ca3af", marginLeft: 4, whiteSpace: "nowrap" },
  btn: { padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 7, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" },
  btnOff: { background: "#9ca3af", cursor: "not-allowed" },

  resultBox: { border: "1px solid", borderRadius: 8, padding: "1rem", display: "flex", flexDirection: "column", gap: 8 },
  resultTop: { display: "flex", alignItems: "center", gap: 10 },
  statusBadge: { padding: "3px 10px", borderRadius: 9999, fontWeight: 700, fontSize: "0.85rem" },
  resultUrl:   { fontFamily: "monospace", fontSize: "0.78rem", color: "#6b7280" },
  resultHeader:{ fontFamily: "monospace", fontSize: "0.78rem", background: "#f3f4f6", padding: "4px 10px", borderRadius: 4, color: "#374151" },
  resultReason:{ fontSize: "0.82rem", color: "#6b7280", margin: 0, lineHeight: 1.6 },
};
