import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=900, stale-while-revalidate=300";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const PRESS = [
  { outlet: "TechCrunch",    title: "Contentstack Launch redefines edge-first deployment for headless CMS", date: "Jun 25, 2026" },
  { outlet: "The Verge",     title: "How cache priming is eliminating cold-start latency across CDN networks", date: "Jun 18, 2026" },
  { outlet: "Forbes",        title: "The hidden cost of uncached pages: a $2M story", date: "Jun 10, 2026" },
  { outlet: "Wired",         title: "Edge functions are reshaping how we think about server-side rendering", date: "May 30, 2026" },
  { outlet: "Smashing Mag",  title: "A practical guide to Cache-Control headers in production Next.js", date: "May 20, 2026" },
];

export default function Press({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Press</h1>
      <p style={s.lead}>
        15-minute CDN cache — <strong>900 seconds</strong>. Press coverage is added
        occasionally; a 15-minute cache keeps it fresh without hammering the origin.
      </p>
      <CacheCard strategy="medium" header={CACHE_HEADER} renderedAt={renderedAt} />

      <ul style={s.list}>
        {PRESS.map((p) => (
          <li key={p.title} style={s.item}>
            <span style={s.outlet}>{p.outlet}</span>
            <p style={s.title}>{p.title}</p>
            <p style={s.date}>{p.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginTop: "2rem" },
  item: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem 1.125rem" },
  outlet: { fontSize: "0.72rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em" },
  title:  { fontWeight: 500, fontSize: "0.9rem", margin: "6px 0 4px", lineHeight: 1.5 },
  date:   { fontSize: "0.75rem", color: "#9ca3af" },
};
