"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveHeroContent, saveService, deleteService, savePortfolioProject, deletePortfolioProject } from "@/actions/content";

export default function ContentManager({ initialHero, initialServices, initialPortfolio }: any) {
  const [tab, setTab] = useState("hero");

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
        <button onClick={() => setTab("hero")} className={`btn-secondary ${tab === "hero" ? "!bg-white !text-black" : ""}`}>Hero Section</button>
        <button onClick={() => setTab("services")} className={`btn-secondary ${tab === "services" ? "!bg-white !text-black" : ""}`}>Services</button>
        <button onClick={() => setTab("portfolio")} className={`btn-secondary ${tab === "portfolio" ? "!bg-white !text-black" : ""}`}>Portfolio</button>
      </div>

      {tab === "hero" && <HeroEditor hero={initialHero} />}
      {tab === "services" && <ServicesEditor services={initialServices} />}
      {tab === "portfolio" && <PortfolioEditor portfolio={initialPortfolio} />}
    </div>
  );
}

function HeroEditor({ hero }: any) {
  const [formData, setFormData] = useState(hero);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await saveHeroContent(formData);
    toast.success("Hero content saved!");
    setSaving(false);
  }

  return (
    <div className="stealth-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Edit Hero Section</h2>
      
      <label>Badge Text</label>
      <input type="text" value={formData.badgeText} onChange={e => setFormData({...formData, badgeText: e.target.value})} style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem", color: "white", borderRadius: "4px" }} />

      <label>Headline</label>
      <input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem", color: "white", borderRadius: "4px" }} />

      <label>Description</label>
      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem", color: "white", borderRadius: "4px", minHeight: "100px" }} />

      <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ marginTop: "1rem", alignSelf: "flex-start" }}>
        {saving ? "Saving..." : "Save Hero Content"}
      </button>
    </div>
  )
}

function ServicesEditor({ services }: any) {
  // Keeping it simple for now to avoid massive file sizes. We'll show a JSON-like editor or simple inputs.
  // We can expand this later.
  return (
    <div className="stealth-card">
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Edit Services</h2>
      <p className="text-muted">Services editing UI coming soon. You can build out the list editor similar to Hero Editor.</p>
    </div>
  )
}

function PortfolioEditor({ portfolio }: any) {
  const [items, setItems] = useState(portfolio);
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: any, id: string | undefined, index: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);

    if (json.success) {
      toast.success("Image uploaded!");
      const newItems = [...items];
      newItems[index].imagePath = json.url;
      setItems(newItems);
      // Auto save
      await savePortfolioProject(newItems[index]);
    } else {
      toast.error("Upload failed");
    }
  }

  async function handleSave(item: any) {
    await savePortfolioProject(item);
    toast.success("Project saved!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {items.map((item: any, i: number) => (
        <div key={item.id} className="stealth-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ fontSize: "1.2rem" }}>Edit Project {i + 1}</h3>
          
          <label>Title</label>
          <input type="text" value={item.title} onChange={e => { const newItems = [...items]; newItems[i].title = e.target.value; setItems(newItems); }} style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem", color: "white", borderRadius: "4px" }} />

          <label>Category</label>
          <input type="text" value={item.category} onChange={e => { const newItems = [...items]; newItems[i].category = e.target.value; setItems(newItems); }} style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "0.5rem", color: "white", borderRadius: "4px" }} />

          <label>Image Upload</label>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img src={item.imagePath} alt="preview" style={{ width: "100px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--color-border)" }} />
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, item.id, i)} />
            {uploading && <span className="text-accent">Uploading...</span>}
          </div>

          <button onClick={() => handleSave(item)} className="btn-primary" style={{ marginTop: "1rem", alignSelf: "flex-start" }}>
            Save Project
          </button>
        </div>
      ))}
    </div>
  )
}
