import Link from "next/link";

const CACHE_HEADER = "public, s-maxage=300, stale-while-revalidate=60";

// --- deterministic content pools ---

const CATEGORIES = ["Technology", "Design", "Business", "Science", "Health", "Culture", "Travel", "Finance", "Engineering", "Product"];

const AUTHORS = [
  "Alice Chen", "Bob Marques", "Carla Singh", "Daniel Park", "Eva Torres",
  "Frank Liu", "Grace Kim", "Hiro Tanaka", "Isabel Costa", "James Wright",
];

const TITLES = [
  "Understanding {topic} at Scale",
  "A Deep Dive into {topic}",
  "Why {topic} Matters in {year}",
  "The Future of {topic}",
  "{topic}: Lessons from the Field",
  "How We Improved {topic} by 10x",
  "Rethinking {topic} from First Principles",
  "The Hidden Complexity of {topic}",
  "{topic} Patterns You Should Know",
  "Building Better Systems with {topic}",
];

const TOPICS = [
  "Cache Invalidation", "CDN Architecture", "Edge Computing", "HTTP Headers",
  "Server-Side Rendering", "Static Generation", "API Design", "Web Performance",
  "Database Indexing", "Load Balancing", "Content Delivery", "DNS Resolution",
  "TLS Handshakes", "Service Workers", "Browser Caching", "Stale-While-Revalidate",
  "Incremental Static Regeneration", "Middleware Chains", "Rate Limiting", "Origin Shielding",
];

const TAGS_POOL = [
  "caching", "performance", "cdn", "nextjs", "ssr", "edge", "http", "devops",
  "frontend", "backend", "infra", "web", "optimization", "deploy", "scale",
];

const PARAGRAPHS = [
  "When building applications at scale, the way you handle caching can make or break your user experience. A well-designed cache layer reduces origin load dramatically and keeps latency low across all regions.",
  "The stale-while-revalidate directive is one of the most powerful tools in a web developer's arsenal. It allows the CDN to serve a slightly stale response while fetching a fresh one in the background, giving users instant responses without ever seeing outdated data for too long.",
  "Content delivery networks work by storing copies of your responses at edge locations around the world. When a user requests a page, the nearest edge node serves it — eliminating round-trip latency to your origin server.",
  "HTTP cache headers are a contract between your server and the caches in between. Setting them incorrectly means either too much stale content reaching users, or too many unnecessary trips to your origin.",
  "s-maxage is the CDN-specific counterpart to max-age. While max-age controls browser caching, s-maxage tells shared caches like CDNs exactly how long they should hold onto a response before revalidating.",
  "Cache priming — the process of warming a CDN cache before real users arrive — is especially important after deployments. Without it, the first wave of users after a release experiences cold-cache latency on every page.",
  "Origin shielding reduces the number of requests that reach your actual servers by funneling all CDN revalidation traffic through a single 'shield' node. This protects your origin from traffic spikes during cache misses.",
  "One common mistake is setting overly long cache TTLs without a reliable purge strategy. If your content changes and you can't invalidate the cache, users will see stale data until the TTL expires.",
  "The relationship between TTL and stale-while-revalidate windows is subtle. A short s-maxage with a long stale window is often better than a long s-maxage alone — users get freshness without sacrificing availability.",
  "Deploy-time cache priming is particularly valuable for sites with long cache TTLs. If a page is cached for 24 hours and you deploy new content, priming ensures the new version is in cache immediately rather than hours later.",
];

// Deterministic pick from an array based on page number + seed
function pick(arr, n, seed = 0) {
  return arr[(n + seed) % arr.length];
}

function buildContent(pageNum) {
  const category  = pick(CATEGORIES, pageNum);
  const author    = pick(AUTHORS,    pageNum, 3);
  const topic     = pick(TOPICS,     pageNum, 7);
  const titleTpl  = pick(TITLES,     pageNum, 1);
  const title     = titleTpl.replace("{topic}", topic).replace("{year}", "2026");
  const para1     = pick(PARAGRAPHS, pageNum, 0);
  const para2     = pick(PARAGRAPHS, pageNum, 4);
  const para3     = pick(PARAGRAPHS, pageNum, 8);
  const readMin   = 2 + (pageNum % 9);
  const tagCount  = 3 + (pageNum % 3);
  const tags      = Array.from({ length: tagCount }, (_, i) => pick(TAGS_POOL, pageNum, i * 5));

  // Fake publish date: spread across the last 2 years
  const dayOffset = pageNum * 17 % 730;
  const date = new Date("2026-06-30");
  date.setDate(date.getDate() - dayOffset);
  const published = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return { category, author, title, para1, para2, para3, readMin, tags, published };
}

// Named domains — full access, all pages available
const FULL_ACCESS_DOMAINS = [
  "priming.contentstackapps.com",
  "cacepriming.contentstackapps.com",
  "caching.contentstackapps.com",
  "sakshikoli.contentstackapps.com",
];

// Domain-based availability tiers (checked at origin, not edge)
// Tier 1  domain-1  to domain-24        : all pages available
// Tier 2  domain-25 to domain-48        : only pages 1–500
// Tier 3  domain-49 to domain-72        : only pages 1–250
// Named / unrecognised domains          : all pages available
function getPageLimitForDomain(host) {
  if (FULL_ACCESS_DOMAINS.some((d) => host.includes(d))) return null;
  const match = (host || "").match(/domain-(\d+)\./);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  if (n >= 1  && n <= 24) return 981;
  if (n >= 25 && n <= 48) return 500;
  if (n >= 49 && n <= 72) return 250;
  return null;
}

export async function getServerSideProps({ params, req, res }) {
  const slug  = params.slug;
  const match = slug.match(/^page-(\d+)$/);
  if (!match) return { notFound: true };

  const pageNum = parseInt(match[1], 10);
  if (pageNum < 1 || pageNum > 981) return { notFound: true };

  // Check if this page exists on the requesting domain
  const host  = req.headers.host || "";
  const limit = getPageLimitForDomain(host);
  if (limit !== null && pageNum > limit) {
    return { notFound: true }; // request reached origin, origin says 404
  }

  res.setHeader("Cache-Control", CACHE_HEADER);
  const content = buildContent(pageNum);

  return {
    props: {
      pageNum,
      renderedAt: new Date().toISOString(),
      prev: pageNum > 1    ? `/test/page-${pageNum - 1}` : null,
      next: pageNum < 1000 ? `/test/page-${pageNum + 1}` : null,
      ...content,
    },
  };
}

export default function TestPage({ pageNum, renderedAt, prev, next, category, author, title, para1, para2, para3, readMin, tags, published }) {
  return (
    <div>
      <div style={s.breadcrumb}>
        <Link href="/" style={s.breadLink}>Home</Link>
        <span style={s.sep}>/</span>
        <span style={s.breadCurrent}>test / page-{pageNum}</span>
      </div>

      <div style={s.meta}>
        <span style={s.category}>{category}</span>
        <span style={s.dot}>·</span>
        <span style={s.metaText}>{published}</span>
        <span style={s.dot}>·</span>
        <span style={s.metaText}>{readMin} min read</span>
        <span style={s.dot}>·</span>
        <span style={s.metaText}>by {author}</span>
      </div>

      <h1 style={s.h1}>{title}</h1>

      <div style={s.tags}>
        {tags.map((tag) => (
          <span key={tag} style={s.tag}>#{tag}</span>
        ))}
      </div>

      <div style={s.body}>
        <p style={s.para}>{para1}</p>
        <p style={s.para}>{para2}</p>
        <p style={s.para}>{para3}</p>
      </div>

      <div style={s.cacheCard}>
        <div style={s.cacheRow}>
          <div>
            <p style={s.cacheLabel}>Cache-Control</p>
            <code style={s.cacheValue}>{CACHE_HEADER}</code>
          </div>
          <div>
            <p style={s.cacheLabel}>Server rendered at</p>
            <code style={s.cacheValue}>{new Date(renderedAt).toLocaleTimeString()} <span style={s.iso}>({renderedAt})</span></code>
          </div>
        </div>
        <p style={s.hint}>Reload repeatedly — a frozen timestamp means the CDN is serving from cache.</p>
      </div>

      <div style={s.progressWrap}>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressBar, width: `${(pageNum / 1000) * 100}%` }} />
        </div>
        <span style={s.progressLabel}>Page {pageNum} of 1000</span>
      </div>

      <div style={s.nav}>
        {prev ? <Link href={prev} style={s.navBtn}>← prev</Link> : <span style={s.navOff}>← prev</span>}
        <span style={s.pageNum}>#{pageNum}</span>
        {next ? <Link href={next} style={s.navBtn}>next →</Link> : <span style={s.navOff}>next →</span>}
      </div>
    </div>
  );
}

const s = {
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, marginBottom: "1.25rem", fontSize: "0.82rem" },
  breadLink:  { color: "#6b7280", textDecoration: "none" },
  sep:        { color: "#d1d5db" },
  breadCurrent: { color: "#374151", fontFamily: "monospace" },

  meta: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: "0.75rem" },
  category: {
    padding: "2px 8px", borderRadius: 9999, background: "#f0f9ff",
    color: "#0284c7", fontSize: "0.72rem", fontWeight: 700,
  },
  dot:      { color: "#d1d5db", fontSize: "0.75rem" },
  metaText: { fontSize: "0.8rem", color: "#9ca3af" },

  h1: { fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.3, marginBottom: "1rem", color: "#111827" },

  tags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" },
  tag:  { fontSize: "0.72rem", color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 4 },

  body: { display: "flex", flexDirection: "column", gap: 16, marginBottom: "1.75rem" },
  para: { fontSize: "0.9rem", color: "#374151", lineHeight: 1.8 },

  cacheCard: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
    padding: "1rem 1.25rem", marginBottom: "1.5rem",
    display: "flex", flexDirection: "column", gap: 8,
  },
  cacheRow:  { display: "flex", flexDirection: "column", gap: 10 },
  cacheLabel: { fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", margin: "0 0 2px" },
  cacheValue: { fontFamily: "monospace", fontSize: "0.78rem", color: "#374151" },
  iso:  { color: "#9ca3af" },
  hint: { fontSize: "0.75rem", color: "#9ca3af", margin: 0 },

  progressWrap: { display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" },
  progressTrack: { flex: 1, height: 5, background: "#f3f4f6", borderRadius: 9999, overflow: "hidden" },
  progressBar:   { height: "100%", background: "#0284c7", borderRadius: 9999 },
  progressLabel: { fontSize: "0.75rem", color: "#9ca3af", whiteSpace: "nowrap" },

  nav:     { display: "flex", alignItems: "center", justifyContent: "space-between" },
  navBtn:  { padding: "7px 16px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, textDecoration: "none", fontSize: "0.85rem", fontWeight: 500, color: "#374151" },
  navOff:  { padding: "7px 16px", background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 7, fontSize: "0.85rem", color: "#d1d5db" },
  pageNum: { fontSize: "0.82rem", color: "#9ca3af" },
};
