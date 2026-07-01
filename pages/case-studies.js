import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=300, stale-while-revalidate=60";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const STUDIES = [
  { company: "RetailCo", industry: "E-commerce",  result: "68% reduction in TTFB",      stat: "68%",  desc: "Implemented cache priming across 40 domains after each deployment, eliminating cold-start latency for peak traffic windows." },
  { company: "NewsHub",  industry: "Media",        result: "4× more concurrent readers", stat: "4×",   desc: "Edge caching with stale-while-revalidate allowed real-time news pages to serve millions of readers without origin overload." },
  { company: "FinanceX", industry: "Finance",      result: "99.99% cache hit rate",      stat: "99.99%", desc: "Strict s-maxage policies combined with deploy-time cache warming ensured traders always got fresh data from the CDN edge." },
  { company: "SaaSCore", industry: "SaaS",         result: "40% infra cost reduction",   stat: "40%",  desc: "Replacing origin-served SSR pages with CDN-cached responses reduced compute costs dramatically at scale." },
];

export default function CaseStudies({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Case Studies</h1>
      <p style={s.lead}>
        5-minute CDN cache — <strong>300 seconds</strong>. Case studies are editorial content
        updated infrequently; a 5-minute cache is a good balance.
      </p>
      <CacheCard strategy="medium" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.grid}>
        {STUDIES.map((cs) => (
          <div key={cs.company} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{cs.company[0]}</div>
              <div>
                <p style={s.company}>{cs.company}</p>
                <p style={s.industry}>{cs.industry}</p>
              </div>
            </div>
            <p style={s.stat}>{cs.stat}</p>
            <p style={s.result}>{cs.result}</p>
            <p style={s.desc}>{cs.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: "2rem" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10 },
  cardTop: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 8, background: "#f0f9ff", color: "#0284c7", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" },
  company: { fontWeight: 700, fontSize: "0.875rem" },
  industry:{ fontSize: "0.75rem", color: "#9ca3af" },
  stat:    { fontSize: "2rem", fontWeight: 800, color: "#0284c7", lineHeight: 1 },
  result:  { fontSize: "0.875rem", fontWeight: 600, color: "#111827" },
  desc:    { fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 },
};
