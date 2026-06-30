import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=30, stale-while-revalidate=15";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const HEADLINES = [
  { tag: "Tech", title: "Next.js 16 ships with built-in cache telemetry", time: "2 min ago" },
  { tag: "Web", title: "CDN providers race to support stale-while-revalidate at the edge", time: "8 min ago" },
  { tag: "Dev", title: "HTTP/3 adoption hits 30% of top-1000 sites", time: "15 min ago" },
  { tag: "Security", title: "Cache poisoning vulnerabilities found in popular reverse proxies", time: "1 hr ago" },
  { tag: "Infra", title: "Cloudflare expands edge cache rules with header-based controls", time: "2 hr ago" },
];

const TAG_COLOR = {
  Tech: "#0891b2", Web: "#7c3aed", Dev: "#059669",
  Security: "#dc2626", Infra: "#d97706",
};

export default function News({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>News</h1>
      <p style={s.lead}>
        Very short CDN cache — <strong>30 seconds</strong>. Headlines update frequently so the
        cache window is deliberately tiny. stale-while-revalidate keeps latency low during
        the background refresh.
      </p>
      <CacheCard strategy="very-short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Latest Headlines</h2>
      <ul style={s.list}>
        {HEADLINES.map((h) => (
          <li key={h.title} style={s.item}>
            <span style={{ ...s.tag, background: TAG_COLOR[h.tag] + "22", color: TAG_COLOR[h.tag] }}>
              {h.tag}
            </span>
            <div style={s.content}>
              <p style={s.title}>{h.title}</p>
              <p style={s.time}>{h.time}</p>
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
  list: { listStyle: "none", display: "flex", flexDirection: "column", gap: 8 },
  item: {
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "0.85rem 1rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 8,
  },
  tag: {
    flexShrink: 0, padding: "2px 8px", borderRadius: 9999,
    fontSize: "0.7rem", fontWeight: 700, marginTop: 2,
  },
  content: { flex: 1 },
  title: { fontWeight: 500, fontSize: "0.9rem", marginBottom: 4 },
  time: { fontSize: "0.75rem", color: "#9ca3af" },
};
