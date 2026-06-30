import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=86400, stale-while-revalidate=43200";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const SECTIONS = [
  {
    title: "Getting Started",
    items: ["Installation", "Configuration", "Your first page"],
  },
  {
    title: "Caching Concepts",
    items: ["s-maxage", "stale-while-revalidate", "no-store vs no-cache", "CDN vs Browser cache"],
  },
  {
    title: "Advanced",
    items: ["Cache priming", "Purging strategies", "Vary headers", "Cache-busting"],
  },
];

export default function Docs({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Documentation</h1>
      <p style={s.lead}>
        Very long-lived CDN cache. Cached for <strong>24 hours</strong> — suited for stable
        documentation that rarely changes outside of a new deployment.
      </p>
      <CacheCard strategy="very-long" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.sections}>
        {SECTIONS.map((sec) => (
          <div key={sec.title} style={s.section}>
            <h2 style={s.sectionTitle}>{sec.title}</h2>
            <ul style={s.list}>
              {sec.items.map((item) => (
                <li key={item} style={s.item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  sections: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: "2rem" },
  section: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1.25rem" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 700, marginBottom: 12, color: "#374151" },
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: 6 },
  item: {
    fontSize: "0.85rem", color: "#6b7280", padding: "5px 8px",
    background: "#f9fafb", borderRadius: 4, cursor: "default",
  },
};
