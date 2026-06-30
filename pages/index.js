import Link from "next/link";
import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "no-store";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const ROUTES = [
  {
    href: "/",
    title: "Home  /",
    strategy: "none",
    header: "no-store",
    description: "Always fetched fresh. CDN never caches this page.",
  },
  {
    href: "/blog",
    title: "Blog  /blog",
    strategy: "short",
    header: "public, s-maxage=60, stale-while-revalidate=30",
    description: "CDN caches for 60 s, then revalidates in the background while serving stale.",
  },
  {
    href: "/products",
    title: "Products  /products",
    strategy: "medium",
    header: "public, s-maxage=300, stale-while-revalidate=60",
    description: "5-minute CDN cache with a 1-minute stale window.",
  },
  {
    href: "/about",
    title: "About  /about",
    strategy: "long",
    header: "public, s-maxage=3600, stale-while-revalidate=1800",
    description: "1-hour CDN cache — good for rarely-changing content.",
  },
  {
    href: "/docs",
    title: "Docs  /docs",
    strategy: "very-long",
    header: "public, s-maxage=86400, stale-while-revalidate=43200",
    description: "24-hour CDN cache — suited for stable documentation.",
  },
];

const STRATEGY_COLOR = {
  none: "#dc2626", short: "#d97706", medium: "#0891b2",
  long: "#059669", "very-long": "#7c3aed",
};

export default function Home({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Next.js Cache-Control Demo</h1>
      <p style={s.lead}>
        Each route sets a different <code style={s.code}>Cache-Control</code> response header
        via <code style={s.code}>getServerSideProps</code>. Navigate between pages and watch
        the server timestamp — a frozen timestamp means the CDN returned a cached response.
      </p>

      <CacheCard strategy="none" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Routes & their caching strategies</h2>
      <div style={s.grid}>
        {ROUTES.map((r) => (
          <Link key={r.href} href={r.href} style={s.card}>
            <div style={s.cardTop}>
              <code style={{ ...s.routeHref, color: STRATEGY_COLOR[r.strategy] }}>{r.href}</code>
            </div>
            <p style={s.cardTitle}>{r.title.split("  ")[0]}</p>
            <code style={s.cardHeader}>{r.header}</code>
            <p style={s.cardDesc}>{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  code: { fontFamily: "monospace", fontSize: "0.9em", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  h2: { fontSize: "1.05rem", fontWeight: 600, margin: "2rem 0 1rem", color: "#374151" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 },
  card: {
    display: "block", padding: "1rem 1.125rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 10, textDecoration: "none", color: "inherit",
  },
  cardTop: { marginBottom: 4 },
  routeHref: { fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 700 },
  cardTitle: { fontSize: "0.8rem", color: "#9ca3af", marginBottom: 8 },
  cardHeader: {
    display: "block", fontFamily: "monospace", fontSize: "0.7rem", color: "#0891b2",
    background: "#ecfeff", padding: "4px 8px", borderRadius: 4, marginBottom: 8,
    wordBreak: "break-all",
  },
  cardDesc: { fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5 },
};
