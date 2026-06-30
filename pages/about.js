import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=1800";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const TEAM = [
  { name: "Alice Chen", role: "Founder & CEO" },
  { name: "Bob Marques", role: "Head of Engineering" },
  { name: "Carla Singh", role: "Product Design" },
  { name: "Daniel Park", role: "Infrastructure" },
];

export default function About({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>About</h1>
      <p style={s.lead}>
        Long-lived CDN cache. Cached for <strong>1 hour</strong> — ideal for mostly-static
        pages like About or Company Info that change only on deploys.
      </p>
      <CacheCard strategy="long" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Our Mission</h2>
      <p style={s.body}>
        We build tools that help developers understand and control HTTP caching across
        CDN edges — because fast pages start with correctly cached responses.
      </p>

      <h2 style={s.h2}>Team</h2>
      <div style={s.grid}>
        {TEAM.map((m) => (
          <div key={m.name} style={s.card}>
            <div style={s.avatar}>{m.name[0]}</div>
            <p style={s.memberName}>{m.name}</p>
            <p style={s.memberRole}>{m.role}</p>
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
  body: { color: "#6b7280", lineHeight: 1.7, maxWidth: 540 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 },
  card: {
    padding: "1.25rem 1rem", background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 8, textAlign: "center",
  },
  avatar: {
    width: 48, height: 48, borderRadius: "50%", background: "#ecfdf5",
    color: "#059669", fontWeight: 700, fontSize: "1.25rem",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 10px",
  },
  memberName: { fontWeight: 600, fontSize: "0.875rem", marginBottom: 4 },
  memberRole: { fontSize: "0.75rem", color: "#9ca3af" },
};
