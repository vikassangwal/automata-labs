"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

// --- Hero Content ---
export const getHeroContent = unstable_cache(
  async () => {
    return await prisma.heroContent.findFirst();
  },
  ["hero-content"],
  { tags: ["content"] }
);

export async function saveHeroContent(data: {
  badgeText: string;
  headline: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
}) {
  const existing = await prisma.heroContent.findFirst();
  if (existing) {
    await prisma.heroContent.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.heroContent.create({
      data,
    });
  }
  revalidateTag("content");
  revalidatePath("/");
}

// --- Services ---
export const getServices = unstable_cache(
  async () => {
    return await prisma.service.findMany({ orderBy: { order: "asc" } });
  },
  ["services"],
  { tags: ["content"] }
);

export async function saveService(data: {
  id?: string;
  title: string;
  description: string;
  iconSvg: string;
  order: number;
}) {
  if (data.id) {
    await prisma.service.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        iconSvg: data.iconSvg,
        order: data.order,
      },
    });
  } else {
    await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        iconSvg: data.iconSvg,
        order: data.order,
      },
    });
  }
  revalidateTag("content");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidateTag("content");
  revalidatePath("/");
}

// --- Portfolio ---
export const getPortfolioProjects = unstable_cache(
  async () => {
    return await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });
  },
  ["portfolio"],
  { tags: ["content"] }
);

export async function savePortfolioProject(data: {
  id?: string;
  title: string;
  category: string;
  imagePath: string;
  gridClass: string;
  link?: string;
  order: number;
}) {
  if (data.id) {
    await prisma.portfolioProject.update({
      where: { id: data.id },
      data: {
        title: data.title,
        category: data.category,
        imagePath: data.imagePath,
        gridClass: data.gridClass,
        link: data.link,
        order: data.order,
      },
    });
  } else {
    await prisma.portfolioProject.create({
      data: {
        title: data.title,
        category: data.category,
        imagePath: data.imagePath,
        gridClass: data.gridClass,
        link: data.link,
        order: data.order,
      },
    });
  }
  revalidateTag("content");
  revalidatePath("/");
}

export async function deletePortfolioProject(id: string) {
  await prisma.portfolioProject.delete({ where: { id } });
  revalidateTag("content");
  revalidatePath("/");
}

// --- Seed Data (Initial Default Content) ---
export async function seedContentIfEmpty() {
  const hero = await prisma.heroContent.findFirst();
  if (!hero) {
    await prisma.heroContent.create({
      data: {
        badgeText: "Automata Framework v2.0 Live",
        headline: "Engineering the Autonomous Enterprise.",
        description: "We build sophisticated AI agents, high-performance web applications, and autonomous workflows that scale your business.",
        button1Text: "Get Started",
        button1Link: "/login",
        button2Text: "View Dashboard",
        button2Link: "/admin",
      }
    });
  }

  const services = await prisma.service.count();
  if (services === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Autonomous Workflows",
          description: "We map and automate complex enterprise processes, reducing operational overhead by up to 80% with guaranteed precision.",
          iconSvg: "workflow",
          order: 1,
        },
        {
          title: "High-Performance Apps",
          description: "Enterprise-grade applications built on Next.js. Engineered for speed, SEO, and absolute scalability from day one.",
          iconSvg: "code",
          order: 2,
        },
        {
          title: "AI Agent Networks",
          description: "Deploy bespoke LLM-powered agents that interact, reason, and execute tasks across your entire software ecosystem.",
          iconSvg: "network",
          order: 3,
        }
      ]
    });
  }

  const projects = await prisma.portfolioProject.count();
  if (projects === 0) {
    await prisma.portfolioProject.createMany({
      data: [
        {
          title: "Nexus Analytics",
          category: "Dashboard UI",
          imagePath: "/stealth-1.png",
          gridClass: "portfolio-item-large",
          order: 1,
        },
        {
          title: "Automata Engine",
          category: "Workflow System",
          imagePath: "/stealth-2.png",
          gridClass: "portfolio-item-small",
          order: 2,
        },
        {
          title: "Capital Sync",
          category: "Financial Platform",
          imagePath: "/stealth-3.png",
          gridClass: "portfolio-item-wide",
          order: 3,
        }
      ]
    });
  }
}
