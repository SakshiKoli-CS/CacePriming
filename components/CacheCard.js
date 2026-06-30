const STRATEGIES = {
  none:       { label: "No Cache",          color: "#dc2626", bg: "#fef2f2" },
  short:      { label: "Short  (1 min)",    color: "#d97706", bg: "#fffbeb" },
  medium:     { label: "Medium (5 min)",    color: "#0891b2", bg: "#ecfeff" },
  long:       { label: "Long   (1 hour)",   color: "#059669", bg: "#ecfdf5" },
  "very-long":{ label: "Very Long (24 hr)", color: "#7c3aed", bg: "#f5f3ff" },
};

export default function CacheCard({ strategy, header, renderedAt }) {
  const meta = STRATEGIES[strategy] ?? STRATEGIES.none;
  return (
    <div style={s.card}>
      <div style={s.row}>
        <span style={{ ...s.badge, color: meta.color, background: meta.bg, border: `1px solid ${meta.color}33` }}>
          {meta.label}
        </span>
        <span style={s.time}>
          Rendered at server: <strong>{new Date(renderedAt).toLocaleTimeString()}</strong>{" "}
          <span style={s.iso}>({renderedAt})</span>
        </span>
      </div>
      <code style={s.header}>Cache-Control: {header}</code>
      <p style={s.hint}>
        Reload repeatedly — if the timestamp freezes, the CDN is serving a cached copy.
      </p>
    </div>
  );
}

const s = {
  card: {
    margin: "1.5rem 0", padding: "1rem 1.25rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 10,
    display: "flex", flexDirection: "column", gap: 10,
  },
  row: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  badge: {
    padding: "3px 10px", borderRadius: 9999, fontSize: "0.75rem",
    fontWeight: 600, letterSpacing: "0.02em",
  },
  time: { fontSize: "0.875rem", color: "#6b7280" },
  iso: { fontSize: "0.75rem", color: "#9ca3af" },
  header: {
    fontFamily: "monospace", fontSize: "0.8rem", background: "#f3f4f6",
    padding: "6px 12px", borderRadius: 6, color: "#374151", wordBreak: "break-all",
  },
  hint: { fontSize: "0.78rem", color: "#9ca3af", lineHeight: 1.5 },
};
