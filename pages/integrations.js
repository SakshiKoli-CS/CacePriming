import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=600, stale-while-revalidate=120";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const INTEGRATIONS = [
  { name: "Cloudflare",   category: "CDN",        status: "stable" },
  { name: "Fastly",       category: "CDN",        status: "stable" },
  { name: "Akamai",       category: "CDN",        status: "stable" },
  { name: "GitHub",       category: "CI/CD",      status: "stable" },
  { name: "Bitbucket",    category: "CI/CD",      status: "stable" },
  { name: "Datadog",      category: "Monitoring", status: "beta"   },
  { name: "Grafana",      category: "Monitoring", status: "stable" },
  { name: "Slack",        category: "Alerts",     status: "stable" },
  { name: "PagerDuty",    category: "Alerts",     status: "beta"   },
  { name: "Vercel",       category: "Deploy",     status: "stable" },
  { name: "Netlify",      category: "Deploy",     status: "stable" },
  { name: "AWS S3",       category: "Storage",    status: "stable" },
];

const CAT_COLOR = { CDN: "#0891b2", "CI/CD": "#7c3aed", Monitoring: "#059669", Alerts: "#dc2626", Deploy: "#d97706", Storage: "#6b7280" };

export default function Integrations({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Integrations</h1>
      <p style={s.lead}>
        10-minute CDN cache — <strong>600 seconds</strong>. Integration listings change
        only when we ship a new connector; a 10-minute cache is safe.
      </p>
      <CacheCard strategy="ten-min" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.grid}>
        {INTEGRATIONS.map((intg) => (
          <div key={intg.name} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.logo}>{intg.name[0]}</div>
              <div>
                <p style={s.name}>{intg.name}</p>
                <span style={{ ...s.cat, color: CAT_COLOR[intg.category], background: CAT_COLOR[intg.category] + "22" }}>{intg.category}</span>
              </div>
            </div>
            <span style={{ ...s.status, ...(intg.status === "beta" ? s.beta : s.stable) }}>{intg.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginTop: "2rem" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTop: { display: "flex", alignItems: "center", gap: 8 },
  logo: { width: 32, height: 32, borderRadius: 6, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem" },
  name: { fontWeight: 600, fontSize: "0.82rem", marginBottom: 2 },
  cat:  { fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: 9999 },
  status: { fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: 9999 },
  stable: { background: "#ecfdf5", color: "#059669" },
  beta:   { background: "#fffbeb", color: "#d97706" },
};
