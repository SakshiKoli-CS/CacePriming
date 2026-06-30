import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=60, stale-while-revalidate=30";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const POSTS = [
  { title: "Understanding HTTP Caching", date: "Jun 28, 2026", min: 5 },
  { title: "s-maxage vs max-age: What's the Difference?", date: "Jun 20, 2026", min: 4 },
  { title: "Stale-While-Revalidate Explained", date: "Jun 15, 2026", min: 6 },
  { title: "CDN Caching Best Practices for Next.js", date: "Jun 10, 2026", min: 8 },
];

export default function Blog({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Blog</h1>
      <p style={s.lead}>
        Short-lived CDN cache. The CDN holds this page for <strong>60 seconds</strong>,
        then revalidates in the background (stale-while-revalidate = 30 s).
      </p>
      <CacheCard strategy="short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Recent Posts</h2>
      <ul style={s.list}>
        {POSTS.map((p) => (
          <li key={p.title} style={s.post}>
            <div>
              <p style={s.postTitle}>{p.title}</p>
              <p style={s.postMeta}>{p.date} · {p.min} min read</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  h2: { fontSize: "1.05rem", fontWeight: 600, margin: "2rem 0 1rem", color: "#374151" },
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10 },
  post: {
    padding: "0.85rem 1rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 8,
  },
  postTitle: { fontWeight: 500, fontSize: "0.9rem", marginBottom: 4 },
  postMeta: { fontSize: "0.78rem", color: "#9ca3af" },
};
