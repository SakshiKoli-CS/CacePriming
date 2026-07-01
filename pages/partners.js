import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=1800";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const PARTNERS = [
  { name: "Cloudflare",  tier: "Premier",    desc: "Global CDN and edge security partner." },
  { name: "Fastly",      tier: "Premier",    desc: "Real-time CDN and edge cloud platform." },
  { name: "AWS",         tier: "Premier",    desc: "Cloud infrastructure and origin hosting." },
  { name: "Vercel",      tier: "Select",     desc: "Frontend cloud deployment platform." },
  { name: "GitHub",      tier: "Select",     desc: "Source control and CI/CD integration." },
  { name: "Datadog",     tier: "Select",     desc: "Monitoring and observability for edge traffic." },
  { name: "Netlify",     tier: "Standard",   desc: "Jamstack deployment and edge functions." },
  { name: "Sentry",      tier: "Standard",   desc: "Error tracking for edge function exceptions." },
];

const TIER_META = {
  Premier:  { color: "#7c3aed", bg: "#f5f3ff" },
  Select:   { color: "#0891b2", bg: "#ecfeff" },
  Standard: { color: "#6b7280", bg: "#f3f4f6" },
};

export default function Partners({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Partners</h1>
      <p style={s.lead}>
        1-hour CDN cache — <strong>3600 seconds</strong>. Partner listings are stable;
        they change only when partnerships are signed or updated.
      </p>
      <CacheCard strategy="long" header={CACHE_HEADER} renderedAt={renderedAt} />

      {["Premier", "Select", "Standard"].map((tier) => (
        <div key={tier} style={s.section}>
          <h2 style={s.h2}>
            <span style={{ ...s.tierLabel, ...TIER_META[tier] }}>{tier}</span> Partners
          </h2>
          <div style={s.grid}>
            {PARTNERS.filter((p) => p.tier === tier).map((p) => (
              <div key={p.name} style={s.card}>
                <div style={s.logo}>{p.name[0]}</div>
                <p style={s.name}>{p.name}</p>
                <p style={s.desc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  section: { marginTop: "2rem" },
  h2:   { display: "flex", alignItems: "center", gap: 8, fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem", color: "#111827" },
  tierLabel: { padding: "2px 8px", borderRadius: 9999, fontSize: "0.75rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem", display: "flex", flexDirection: "column", gap: 6 },
  logo: { width: 36, height: 36, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  name: { fontWeight: 600, fontSize: "0.875rem" },
  desc: { fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.5 },
};
