import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=1800, stale-while-revalidate=600";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const ROLES = [
  { title: "Senior Edge Infrastructure Engineer", team: "Platform",  location: "Remote",          type: "Full-time" },
  { title: "CDN Performance Analyst",             team: "SRE",       location: "San Francisco",   type: "Full-time" },
  { title: "Frontend Engineer — Web Performance", team: "Web",       location: "Remote",          type: "Full-time" },
  { title: "Developer Advocate — Edge Computing", team: "DevRel",    location: "New York",        type: "Full-time" },
  { title: "Technical Writer — Platform Docs",    team: "Docs",      location: "Remote",          type: "Contract"  },
  { title: "QA Engineer — Cache Systems",         team: "Quality",   location: "Austin",          type: "Full-time" },
];

export default function Careers({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Careers</h1>
      <p style={s.lead}>
        30-minute CDN cache — <strong>1800 seconds</strong>. Job listings change
        when roles open or close; a 30-minute cache is appropriate.
      </p>
      <CacheCard strategy="long" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.banner}>
        <h2 style={s.bannerTitle}>Join us in building the edge-first web</h2>
        <p style={s.bannerSub}>We're a remote-first team working on infrastructure that serves billions of cached responses every day.</p>
      </div>

      <h2 style={s.h2}>Open Roles ({ROLES.length})</h2>
      <div style={s.list}>
        {ROLES.map((r) => (
          <div key={r.title} style={s.role}>
            <div>
              <p style={s.roleTitle}>{r.title}</p>
              <p style={s.roleMeta}>{r.team} · {r.location} · {r.type}</p>
            </div>
            <button style={s.applyBtn}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  banner: { background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 12, padding: "2rem", margin: "1.5rem 0", color: "#fff" },
  bannerTitle: { fontSize: "1.25rem", fontWeight: 700, marginBottom: 6 },
  bannerSub:   { fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 },
  h2:   { fontSize: "1.05rem", fontWeight: 600, margin: "1.5rem 0 1rem", color: "#374151" },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  role: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem 1.125rem", gap: 12 },
  roleTitle: { fontWeight: 500, fontSize: "0.9rem", marginBottom: 4 },
  roleMeta:  { fontSize: "0.75rem", color: "#9ca3af" },
  applyBtn:  { padding: "6px 14px", background: "#111827", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", flexShrink: 0 },
};
