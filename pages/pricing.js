import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=600, stale-while-revalidate=120";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    features: ["5 pages cached", "1 CDN region", "Community support", "Basic analytics"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    features: ["Unlimited pages", "10 CDN regions", "Priority support", "Advanced analytics", "Custom TTLs"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    features: ["Everything in Pro", "Global CDN", "SLA guarantee", "Dedicated account manager", "SSO / SAML"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function Pricing({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Pricing</h1>
      <p style={s.lead}>
        10-minute CDN cache — pricing tiers change infrequently and a slightly stale page
        is acceptable. stale-while-revalidate=120 gives a 2-minute background refresh window.
      </p>
      <CacheCard strategy="ten-min" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.grid}>
        {PLANS.map((p) => (
          <div key={p.name} style={{ ...s.card, ...(p.highlight ? s.highlighted : {}) }}>
            {p.highlight && <span style={s.badge}>Most popular</span>}
            <p style={s.planName}>{p.name}</p>
            <p style={s.price}>
              {p.price} <span style={s.period}>{p.period}</span>
            </p>
            <ul style={s.features}>
              {p.features.map((f) => (
                <li key={f} style={s.feature}>
                  <span style={s.check}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button style={{ ...s.cta, ...(p.highlight ? s.ctaHighlight : {}) }}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: "2rem" },
  card: {
    padding: "1.5rem 1.25rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 12, position: "relative",
    display: "flex", flexDirection: "column", gap: 12,
  },
  highlighted: { border: "2px solid #0284c7", boxShadow: "0 4px 16px #0284c71a" },
  badge: {
    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
    background: "#0284c7", color: "#fff", fontSize: "0.7rem", fontWeight: 700,
    padding: "2px 10px", borderRadius: 9999, whiteSpace: "nowrap",
  },
  planName: { fontWeight: 700, fontSize: "1rem" },
  price: { fontSize: "1.5rem", fontWeight: 800 },
  period: { fontSize: "0.8rem", fontWeight: 400, color: "#9ca3af" },
  features: { listStyle: "none", display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  feature: { fontSize: "0.82rem", color: "#6b7280", display: "flex", gap: 6, alignItems: "flex-start" },
  check: { color: "#059669", fontWeight: 700, flexShrink: 0 },
  cta: {
    padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#f9fafb", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600,
  },
  ctaHighlight: { background: "#0284c7", color: "#fff", border: "none" },
};
