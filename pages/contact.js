import { useState } from "react";
import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "no-cache";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

export default function Contact({ renderedAt }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div>
      <h1 style={s.h1}>Contact</h1>
      <p style={s.lead}>
        <code style={s.code}>no-cache</code> — different from <code style={s.code}>no-store</code>.
        The CDN <em>may</em> store a copy, but must revalidate it with the origin on every request
        before serving. Useful when you want conditional GET (304 Not Modified) to save bandwidth
        while still guaranteeing freshness.
      </p>
      <CacheCard strategy="no-cache" header={CACHE_HEADER} renderedAt={renderedAt} />

      <div style={s.columns}>
        <div style={s.info}>
          <h2 style={s.h2}>Get in touch</h2>
          <p style={s.body}>Have a question about caching strategies or want to discuss your use case? We'd love to hear from you.</p>
          <div style={s.contacts}>
            <div style={s.contactRow}><span style={s.icon}>✉</span><span>hello@cachedemo.dev</span></div>
            <div style={s.contactRow}><span style={s.icon}>🌐</span><span>cachedemo.dev</span></div>
            <div style={s.contactRow}><span style={s.icon}>🕐</span><span>Mon – Fri, 9 am – 6 pm UTC</span></div>
          </div>
        </div>

        <form style={s.form} onSubmit={handleSubmit}>
          {sent ? (
            <div style={s.success}>
              <p style={s.successText}>Message sent! We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <label style={s.label}>
                Name
                <input style={s.input} type="text" placeholder="Your name" required />
              </label>
              <label style={s.label}>
                Email
                <input style={s.input} type="email" placeholder="you@example.com" required />
              </label>
              <label style={s.label}>
                Message
                <textarea style={{ ...s.input, ...s.textarea }} placeholder="What would you like to discuss?" required />
              </label>
              <button style={s.submit} type="submit">Send message</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

const s = {
  h1: { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  code: { fontFamily: "monospace", fontSize: "0.9em", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  columns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: "2rem", alignItems: "start" },
  info: {},
  h2: { fontSize: "1.05rem", fontWeight: 600, marginBottom: 10, color: "#374151" },
  body: { color: "#6b7280", lineHeight: 1.7, fontSize: "0.9rem", marginBottom: 20 },
  contacts: { display: "flex", flexDirection: "column", gap: 10 },
  contactRow: { display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "#374151" },
  icon: { fontSize: "1rem", width: 24 },
  form: {
    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10,
    padding: "1.5rem", display: "flex", flexDirection: "column", gap: 14,
  },
  label: { display: "flex", flexDirection: "column", gap: 5, fontSize: "0.82rem", fontWeight: 600, color: "#374151" },
  input: {
    padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6,
    fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
  },
  textarea: { resize: "vertical", minHeight: 100 },
  submit: {
    padding: "9px 16px", background: "#111827", color: "#fff",
    border: "none", borderRadius: 7, fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
  },
  success: { padding: "1.5rem", textAlign: "center" },
  successText: { color: "#059669", fontWeight: 500 },
};
