import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
];

export default function Layout({ children }) {
  const { pathname } = useRouter();
  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>⚡ CacheDemo</span>
        <nav style={s.nav}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ ...s.link, ...(pathname === href ? s.active : {}) }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f8f9fa" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 2rem", height: 56, background: "#fff",
    borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 10,
  },
  logo: { fontWeight: 700, fontSize: "1rem" },
  nav: { display: "flex", gap: 4 },
  link: {
    padding: "6px 12px", borderRadius: 6, textDecoration: "none",
    fontSize: "0.875rem", color: "#6b7280", fontWeight: 500,
  },
  active: { background: "#f3f4f6", color: "#111827" },
  main: { maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" },
};
