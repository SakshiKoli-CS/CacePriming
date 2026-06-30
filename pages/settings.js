import { readFileSync } from "fs";
import { join } from "path";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", "no-store");
  let config = null;
  try {
    const raw = readFileSync(join(process.cwd(), "launch.json"), "utf-8");
    config = JSON.parse(raw);
  } catch {
    // launch.json missing or invalid
  }
  return { props: { config: config ?? null } };
}

const STEPS = [
  { n: 1, title: "launch.json configured", desc: "URLs listed under cache.cachePriming.urls in your project root." },
  { n: 2, title: "Push to GitHub / deploy", desc: "Trigger a deployment on Contentstack Launch via GitHub, Bitbucket, or file upload." },
  { n: 3, title: "Launch primes the cache", desc: "After build, Launch visits each URL using User-Agent: Contentstack-Launch/CachePrimingAgent/1.0." },
  { n: 4, title: "Non-cacheable routes skipped", desc: "Pages with no-store, no-cache, or must-revalidate (no s-maxage) are automatically skipped." },
  { n: 5, title: "CDN cache is warm", desc: "First real users get cached responses instantly — no cold-start latency." },
];

export default function Settings({ config }) {
  const enabled = config?.cache?.cachePriming?.enabled ?? false;
  const urls    = config?.cache?.cachePriming?.urls ?? [];

  return (
    <div>
      <h1 style={s.h1}>Settings</h1>
      <p style={s.lead}>
        Cache priming is configured via <code style={s.code}>launch.json</code> at the project root.
        Contentstack Launch reads this file automatically on each deployment — no manual trigger needed.
      </p>

      {/* Status banner */}
      <div style={{ ...s.banner, ...(enabled ? s.bannerOn : s.bannerOff) }}>
        <span style={s.bannerDot(enabled)} />
        <span>
          Cache priming is <strong>{enabled ? "enabled" : "disabled"}</strong> in{" "}
          <code style={s.code}>launch.json</code>.
          {!enabled && " Set \"enabled\": true to activate on next deploy."}
        </span>
      </div>

      {/* launch.json + URL list */}
      <section style={s.section}>
        <h2 style={s.h2}>launch.json</h2>
        <p style={s.sub}>
          Only relative paths are supported. Fully qualified URLs, wildcards, and regex are not allowed.
        </p>
        {!config ? (
          <div style={s.notice}>
            <strong>launch.json not found.</strong> Create it at the project root to enable cache priming.
          </div>
        ) : (
          <div style={s.configGrid}>
            <div>
              <p style={s.label}>Config file</p>
              <pre style={s.pre}>{JSON.stringify(config, null, 2)}</pre>
            </div>
            <div>
              <p style={s.label}>URLs to prime ({urls.length})</p>
              <ul style={s.urlList}>
                {urls.map((u) => (
                  <li key={u} style={s.urlItem}>
                    <code style={s.mono}>{u}</code>
                    <span style={s.urlNote}>relative path ✓</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* How it works */}
      <section style={s.section}>
        <h2 style={s.h2}>How Contentstack Launch runs cache priming</h2>
        <p style={s.sub}>Happens automatically on every deployment — nothing to trigger manually.</p>
        <ol style={s.steps}>
          {STEPS.map((step) => (
            <li key={step.n} style={s.step}>
              <div style={s.stepNum}>{step.n}</div>
              <div>
                <p style={s.stepTitle}>{step.title}</p>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* User-Agent note */}
      <div style={s.infoBox}>
        <p style={s.infoTitle}>Identifying priming traffic in your logs</p>
        <p style={s.infoBody}>
          All requests made by the cache priming agent include a distinct User-Agent header.
          Use it to filter priming traffic out of your analytics or rate-limiting rules.
        </p>
        <code style={s.uaCode}>User-Agent: Contentstack-Launch/CachePrimingAgent/1.0</code>
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  code: { fontFamily: "monospace", fontSize: "0.88em", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  mono: { fontFamily: "monospace", fontSize: "0.82rem" },

  banner: {
    display: "flex", alignItems: "center", gap: 10,
    margin: "1.25rem 0", padding: "12px 16px", borderRadius: 8,
    fontSize: "0.875rem",
  },
  bannerOn:  { background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#065f46" },
  bannerOff: { background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e" },
  bannerDot: (on) => ({
    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
    background: on ? "#059669" : "#d97706",
  }),

  section: {
    marginTop: "1.75rem", background: "#fff",
    border: "1px solid #e5e7eb", borderRadius: 10, padding: "1.5rem",
  },
  h2:  { fontSize: "1rem", fontWeight: 700, marginBottom: 4, color: "#111827" },
  sub: { fontSize: "0.82rem", color: "#9ca3af", margin: "0 0 1rem" },
  label: { fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", marginBottom: 8 },

  notice: {
    padding: "12px 14px", background: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: 6, fontSize: "0.85rem", color: "#92400e",
  },

  configGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  pre: {
    margin: 0, padding: "1rem", background: "#f9fafb", borderRadius: 6,
    fontSize: "0.78rem", lineHeight: 1.7, color: "#374151", overflowX: "auto",
  },

  urlList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 6 },
  urlItem: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "#f9fafb", borderRadius: 5, padding: "6px 10px",
  },
  urlNote: { fontSize: "0.7rem", color: "#059669", fontWeight: 600 },

  steps: { listStyle: "none", display: "flex", flexDirection: "column", gap: 14 },
  step: { display: "flex", gap: 14, alignItems: "flex-start" },
  stepNum: {
    width: 28, height: 28, borderRadius: "50%", background: "#f3f4f6",
    color: "#374151", fontWeight: 700, fontSize: "0.82rem",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepTitle: { fontWeight: 600, fontSize: "0.875rem", marginBottom: 2 },
  stepDesc:  { fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.5 },

  infoBox: {
    marginTop: "1.75rem", padding: "1.25rem 1.5rem",
    background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10,
  },
  infoTitle: { fontWeight: 700, fontSize: "0.9rem", color: "#0284c7", marginBottom: 4 },
  infoBody:  { fontSize: "0.85rem", color: "#374151", lineHeight: 1.6, marginBottom: 10 },
  uaCode: {
    display: "block", fontFamily: "monospace", fontSize: "0.82rem",
    background: "#e0f2fe", padding: "8px 12px", borderRadius: 6, color: "#0369a1",
  },
};
