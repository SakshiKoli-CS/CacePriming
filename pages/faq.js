import { useState } from "react";
import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=43200, stale-while-revalidate=86400";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const FAQS = [
  {
    q: "What is s-maxage?",
    a: "s-maxage is like max-age but applies only to shared caches (CDNs, proxies). It overrides max-age for those caches while the browser still uses max-age.",
  },
  {
    q: "What does stale-while-revalidate do?",
    a: "It lets the CDN serve a stale cached response immediately while fetching a fresh copy in the background. The user gets low latency; the cache gets updated for the next request.",
  },
  {
    q: "What's the difference between no-store and no-cache?",
    a: "no-store means never write the response to cache at all. no-cache means you may store it, but always revalidate with the origin before serving it.",
  },
  {
    q: "When should I use getServerSideProps vs getStaticProps for caching?",
    a: "Use getServerSideProps when you need per-request logic and set Cache-Control headers to let the CDN cache the server response. Use getStaticProps for pages that can be fully pre-built; combine with revalidate for ISR.",
  },
  {
    q: "Does Cache-Control set in getServerSideProps affect the browser too?",
    a: "Yes — the header is sent on the HTTP response. Browsers respect it too, though s-maxage is ignored by browsers (they only read max-age). You can combine both: s-maxage=300, max-age=0.",
  },
  {
    q: "Why are my cache headers ignored in next dev?",
    a: "Next.js forces no-store in development mode to prevent stale pages while you work. Build and run next start to see the real headers.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <li style={s.item}>
      <button style={s.question} onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span style={{ ...s.chevron, transform: open ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
      </button>
      {open && <p style={s.answer}>{a}</p>}
    </li>
  );
}

export default function FAQ({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>FAQ</h1>
      <p style={s.lead}>
        12-hour CDN cache — FAQs are editorial content that changes only when someone updates
        the docs. stale-while-revalidate=86400 gives a generous 24-hour background window.
      </p>
      <CacheCard strategy="half-day" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Frequently Asked Questions</h2>
      <ul style={s.list}>
        {FAQS.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
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
  item: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" },
  question: {
    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0.9rem 1rem", background: "none", border: "none",
    cursor: "pointer", fontWeight: 500, fontSize: "0.9rem", textAlign: "left", gap: 8,
  },
  chevron: { flexShrink: 0, transition: "transform 0.2s", fontSize: "1rem", color: "#9ca3af" },
  answer: { padding: "0 1rem 0.9rem", fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.7 },
};
