import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Dashboard Overview</h1>
        <LogoutButton />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div className="stealth-card">
          <h3 style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Total Visitors</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>12,450</p>
        </div>
        <div className="stealth-card">
          <h3 style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Active Agents</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>85</p>
        </div>
        <div className="stealth-card">
          <h3 style={{ fontSize: "1rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Consultations</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>14</p>
        </div>
      </div>

      <div className="stealth-card">
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Welcome back, {session.user.name || session.user.email}</h2>
        <p className="text-muted">Use the sidebar to navigate to the Content Manager to update your website content dynamically.</p>
      </div>
    </div>
  )
}
