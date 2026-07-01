import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=7200, stale-while-revalidate=3600";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const MEMBERS = [
  { name: "Alice Chen",     role: "CEO & Co-founder",          dept: "Leadership" },
  { name: "Bob Marques",    role: "CTO & Co-founder",          dept: "Leadership" },
  { name: "Carla Singh",    role: "VP of Engineering",         dept: "Engineering" },
  { name: "Daniel Park",    role: "Head of Edge Infrastructure",dept: "Engineering" },
  { name: "Eva Torres",     role: "Principal CDN Architect",   dept: "Engineering" },
  { name: "Frank Liu",      role: "Head of Product",           dept: "Product" },
  { name: "Grace Kim",      role: "Senior Product Designer",   dept: "Product" },
  { name: "Hiro Tanaka",    role: "Head of Developer Relations",dept: "DevRel" },
  { name: "Isabel Costa",   role: "Head of Sales",             dept: "GTM" },
  { name: "James Wright",   role: "Head of Customer Success",  dept: "GTM" },
];

const DEPT_COLOR = { Leadership: "#7c3aed", Engineering: "#0891b2", Product: "#059669", DevRel: "#d97706", GTM: "#dc2626" };

export default function Team({ renderedAt }) {
  const depts = [...new Set(MEMBERS.map((m) => m.dept))];
  return (
    <div>
      <h1 style={s.h1}>Team</h1>
      <p style={s.lead}>
        2-hour CDN cache — <strong>7200 seconds</strong>. Team pages rarely change;
        a long cache is safe with a 1-hour stale window for background updates.
      </p>
      <CacheCard strategy="long" header={CACHE_HEADER} renderedAt={renderedAt} />

      {depts.map((dept) => (
        <div key={dept} style={s.section}>
          <h2 style={s.h2}>
            <span style={{ ...s.deptDot, background: DEPT_COLOR[dept] }} />{dept}
          </h2>
          <div style={s.grid}>
            {MEMBERS.filter((m) => m.dept === dept).map((m) => (
              <div key={m.name} style={s.card}>
                <div style={{ ...s.avatar, background: DEPT_COLOR[dept] + "22", color: DEPT_COLOR[dept] }}>{m.name.split(" ").map((n) => n[0]).join("")}</div>
                <p style={s.name}>{m.name}</p>
                <p style={s.role}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  section: { marginTop: "2rem" },
  h2:   { display: "flex", alignItems: "center", gap: 8, fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" },
  deptDot: { width: 8, height: 8, borderRadius: "50%" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "1rem", textAlign: "center" },
  avatar: { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem", margin: "0 auto 8px" },
  name: { fontWeight: 600, fontSize: "0.85rem", marginBottom: 3 },
  role: { fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.4 },
};
