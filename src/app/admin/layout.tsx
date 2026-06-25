import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import "../globals.css"; // Ensure styles are loaded

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--color-bg-base)", color: "var(--color-text-main)" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", borderRight: "1px solid var(--color-border)", padding: "2rem", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Admin Panel</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{session.user.email}</p>
        </div>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
          <Link href="/admin" style={{ padding: "0.5rem", borderRadius: "4px", transition: "background 0.2s" }} className="hover:bg-[var(--color-bg-hover)]">
            Dashboard
          </Link>
          <Link href="/admin/content" style={{ padding: "0.5rem", borderRadius: "4px", transition: "background 0.2s" }} className="hover:bg-[var(--color-bg-hover)]">
            Content Manager
          </Link>
          <Link href="/" style={{ padding: "0.5rem", borderRadius: "4px", transition: "background 0.2s", marginTop: "auto" }} className="hover:bg-[var(--color-bg-hover)]">
            ← View Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
