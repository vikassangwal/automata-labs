import { getHeroContent, getServices, getPortfolioProjects, seedContentIfEmpty } from "@/actions/content";
import ContentManager from "./ContentManager";

export default async function ContentPage() {
  await seedContentIfEmpty();
  
  const hero = await getHeroContent();
  const services = await getServices();
  const portfolio = await getPortfolioProjects();

  return (
    <div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "2rem" }}>Content Manager</h1>
      <ContentManager initialHero={hero!} initialServices={services} initialPortfolio={portfolio} />
    </div>
  );
}
