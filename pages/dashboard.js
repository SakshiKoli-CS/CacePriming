import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=30, stale-while-revalidate=15";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const METRICS = [
  { label: "Cache Hit Rate",      value: "98.4%",    delta: "+0.3%",  up: true  },
  { label: "Avg TTFB",            value: "12 ms",    delta: "−4 ms",  up: true  },
  { label: "Primed URLs Today",   value: "18,180",   delta: "+1,009", up: true  },
  { label: "404 on Prime",        value: "32,450",   delta: "+0",     up: false },
  { label: "Active Domains",      value: "75",       delta: "stable", up: null  },
  { label: "Edge Requests / min", value: "142,300",  delta: "+8,200", up: true  },
];

export default function Dashboard({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Dashboard</h1>
      <p style={s.lead}>
        Very short CDN cache — <strong>30 seconds</strong>. Dashboards display
        near-real-time metrics so the TTL is kept low.
      </p>
      <CacheCard strategy="very-short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.grid}>
        {METRICS.map((m) => (
          <div key={m.label} style={s.card}>
            <p style={s.label}>{m.label}</p>
            <p style={s.value}>{m.value}</p>
            <p style={{ ...s.delta, color: m.up === null ? "#9ca3af" : m.up ? "#059669" : "#dc2626" }}>
              {m.delta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginTop: "2rem" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1.125rem" },
  label: { fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", marginBottom: 6 },
  value: { fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 4 },
  delta: { fontSize: "0.78rem", fontWeight: 600 },
};
