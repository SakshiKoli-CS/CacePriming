import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=300, stale-while-revalidate=60";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const PRODUCTS = [
  { name: "Cache Warmer Pro", price: "$49", tag: "Popular" },
  { name: "CDN Optimizer", price: "$79", tag: "New" },
  { name: "Edge Accelerator", price: "$129", tag: "" },
  { name: "Stale Buster", price: "$29", tag: "Sale" },
  { name: "Origin Shield", price: "$99", tag: "" },
  { name: "TTL Manager", price: "$59", tag: "Popular" },
];

export default function Products({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Products</h1>
      <p style={s.lead}>
        Medium-lived CDN cache. Cached for <strong>5 minutes</strong> with a
        1-minute stale window — good for product listings that change infrequently.
      </p>
      <CacheCard strategy="medium" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>All Products</h2>
      <div style={s.grid}>
        {PRODUCTS.map((p) => (
          <div key={p.name} style={s.card}>
            {p.tag && <span style={s.tag}>{p.tag}</span>}
            <p style={s.name}>{p.name}</p>
            <p style={s.price}>{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  h2: { fontSize: "1.05rem", fontWeight: 600, margin: "2rem 0 1rem", color: "#374151" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 },
  card: {
    padding: "1rem", background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 8, position: "relative",
  },
  tag: {
    position: "absolute", top: 8, right: 8,
    fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
    background: "#ecfeff", color: "#0891b2", padding: "2px 6px", borderRadius: 9999,
  },
  name: { fontWeight: 500, fontSize: "0.875rem", marginBottom: 6 },
  price: { fontSize: "1rem", fontWeight: 700, color: "#059669" },
};
