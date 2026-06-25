"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="btn-secondary"
      style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", background: "transparent", color: "var(--color-text-main)", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: "pointer" }}
    >
      Log Out
    </button>
  );
}
