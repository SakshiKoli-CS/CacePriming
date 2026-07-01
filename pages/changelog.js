import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=120, stale-while-revalidate=60";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const ENTRIES = [
  {
    version: "v3.4.0", date: "Jun 28, 2026", tag: "Feature",
    items: ["Cache priming now supports up to 1000 URLs per environment", "Edge function logs retained for 48 hours", "Added x-cache-prime-skip response header"],
  },
  {
    version: "v3.3.2", date: "Jun 14, 2026", tag: "Fix",
    items: ["Fixed 404 responses being incorrectly cached by some CDN nodes", "Resolved race condition in parallel domain priming"],
  },
  {
    version: "v3.3.0", date: "May 30, 2026", tag: "Feature",
    items: ["Multi-domain cache priming now runs in parallel", "New scenario dashboard for testing cache behaviour", "launch.json schema validation on deploy"],
  },
  {
    version: "v3.2.1", date: "May 12, 2026", tag: "Fix",
    items: ["Edge function bundle size limit increased to 1 MiB", "Fixed stale-while-revalidate not respected on Tier 3 nodes"],
  },
];

const TAG_COLOR = { Feature: "#0891b2", Fix: "#dc2626", Improvement: "#7c3aed" };

export default function Changelog({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Changelog</h1>
      <p style={s.lead}>
        2-minute CDN cache — <strong>120 seconds</strong>. Changelogs update on each release
        but don't need real-time freshness.
      </p>
      <CacheCard strategy="short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.entries}>
        {ENTRIES.map((e) => (
          <div key={e.version} style={s.entry}>
            <div style={s.entryLeft}>
              <code style={s.version}>{e.version}</code>
              <span style={s.date}>{e.date}</span>
              <span style={{ ...s.tag, background: TAG_COLOR[e.tag] + "22", color: TAG_COLOR[e.tag] }}>{e.tag}</span>
            </div>
            <ul style={s.items}>
              {e.items.map((item) => <li key={item} style={s.item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  entries: { display: "flex", flexDirection: "column", gap: 0, marginTop: "2rem" },
  entry: { display: "grid", gridTemplateColumns: "160px 1fr", gap: 20, padding: "1.25rem 0", borderBottom: "1px solid #f3f4f6" },
  entryLeft: { display: "flex", flexDirection: "column", gap: 4 },
  version: { fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 700, color: "#111827" },
  date:    { fontSize: "0.75rem", color: "#9ca3af" },
  tag:     { alignSelf: "flex-start", fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: 9999 },
  items:   { paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: 6 },
  item:    { fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 },
};
