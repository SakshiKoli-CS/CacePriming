import CacheCard from "../components/CacheCard";

const CACHE_HEADER = "public, s-maxage=60, stale-while-revalidate=30";

export async function getServerSideProps({ res }) {
  res.setHeader("Cache-Control", CACHE_HEADER);
  return { props: { renderedAt: new Date().toISOString() } };
}

const EVENTS = [
  { title: "CacheCon 2026",              date: "Jul 15, 2026", location: "San Francisco, CA",  type: "Conference", spots: 42  },
  { title: "Edge Computing Workshop",    date: "Jul 22, 2026", location: "Online",             type: "Workshop",   spots: 120 },
  { title: "CDN Performance Summit",     date: "Aug 5, 2026",  location: "New York, NY",       type: "Summit",     spots: 8   },
  { title: "Web Performance Meetup",     date: "Aug 12, 2026", location: "London, UK",         type: "Meetup",     spots: 55  },
  { title: "Launch Platform Deep Dive",  date: "Aug 19, 2026", location: "Online",             type: "Webinar",    spots: 200 },
  { title: "Headless CMS Workshop",      date: "Sep 3, 2026",  location: "Austin, TX",         type: "Workshop",   spots: 30  },
];

const TYPE_COLOR = { Conference: "#7c3aed", Workshop: "#0891b2", Summit: "#dc2626", Meetup: "#059669", Webinar: "#d97706" };

export default function Events({ renderedAt }) {
  return (
    <div>
      <h1 style={s.h1}>Events</h1>
      <p style={s.lead}>
        Short CDN cache — <strong>60 seconds</strong>. Event listings change when spots fill up,
        so we keep the TTL tight with a 30-second stale window.
      </p>
      <CacheCard strategy="short" header={CACHE_HEADER} renderedAt={renderedAt} />

      <h2 style={s.h2}>Upcoming Events</h2>
      <div style={s.grid}>
        {EVENTS.map((e) => (
          <div key={e.title} style={s.card}>
            <span style={{ ...s.type, background: TYPE_COLOR[e.type] + "22", color: TYPE_COLOR[e.type] }}>{e.type}</span>
            <p style={s.title}>{e.title}</p>
            <p style={s.meta}>{e.date} · {e.location}</p>
            <p style={s.spots}>{e.spots} spots left</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  h1:   { fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 },
  lead: { color: "#6b7280", lineHeight: 1.7 },
  h2:   { fontSize: "1.05rem", fontWeight: 600, margin: "2rem 0 1rem", color: "#374151" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: 6 },
  type: { alignSelf: "flex-start", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 9999 },
  title: { fontWeight: 600, fontSize: "0.9rem" },
  meta:  { fontSize: "0.78rem", color: "#9ca3af" },
  spots: { fontSize: "0.78rem", fontWeight: 600, color: "#059669" },
};
