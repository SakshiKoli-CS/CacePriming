import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=10, stale-while-revalidate=5";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const SERVICES = [
  { name: "CDN Edge Network",        status: "operational",   uptime: "99.99%" },
  { name: "Cache Priming Agent",      status: "operational",   uptime: "99.97%" },
  { name: "Origin Servers",           status: "operational",   uptime: "99.95%" },
  { name: "DNS Resolution",           status: "degraded",      uptime: "99.80%" },
  { name: "Build Pipeline",           status: "operational",   uptime: "99.92%" },
  { name: "GraphQL API",              status: "operational",   uptime: "99.98%" },
  { name: "Asset Delivery",           status: "maintenance",   uptime: "98.50%" },
  { name: "Log Streaming",            status: "operational",   uptime: "99.90%" },
];

const STATUS_META = {
  operational: { color: "#059669", bg: "#ecfdf5", dot: "#10b981" },
  degraded:    { color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  maintenance: { color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
};

export default function Status({ renderedAt }) {
  const issues = SERVICES.filter((s) => s.status !== "operational").length;
  return (
    <div>
      <h1 style={s.h1}>System Status</h1>
      <p style={s.lead}>
        Very short CDN cache — <strong>10 seconds</strong>. Status pages need to reflect
        real-time health so the TTL is kept extremely low.
      </p>
      <CacheCard strategy="very-short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={{ ...s.overall, background: issues === 0 ? "#ecfdf5" : "#fffbeb", borderColor: issues === 0 ? "#6ee7b7" : "#fde68a" }}>
        <span style={{ ...s.overallDot, background: issues === 0 ? "#10b981" : "#f59e0b" }} />
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          {issues === 0 ? "All systems operational" : `${issues} service${issues > 1 ? "s" : ""} affected`}
        </span>
      </div>

      <div style={s.list}>
        {SERVICES.map((svc) => {
          const meta = STATUS_META[svc.status];
          return (
            <div key={svc.name} style={s.row}>
              <div style={s.rowLeft}>
                <span style={{ ...s.dot, background: meta.dot }} />
                <span style={s.svcName}>{svc.name}</span>
              </div>
              <div style={s.rowRight}>
                <span style={{ ...s.badge, color: meta.color, background: meta.bg }}>{svc.status}</span>
                <span style={s.uptime}>{svc.uptime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  overall: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, border: "1px solid", margin: "1.25rem 0" },
  overallDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  row:  { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px" },
  rowLeft:  { display: "flex", alignItems: "center", gap: 10 },
  rowRight: { display: "flex", alignItems: "center", gap: 12 },
  dot:     { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  svcName: { fontSize: "0.875rem", fontWeight: 500 },
  badge:   { fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999 },
  uptime:  { fontSize: "0.78rem", color: "#9ca3af", fontFamily: "monospace" },
};
