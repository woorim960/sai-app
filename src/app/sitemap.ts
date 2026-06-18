import type { MetadataRoute } from "next";
import { getAllSituations, decks } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sai.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/home`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/onboarding`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const situationRoutes = getAllSituations().map((situation) => ({
    url: `${siteUrl}/situations/${situation.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const deckRoutes = decks.flatMap((deck) => [
    {
      url: `${siteUrl}/decks/${deck.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticRoutes, ...situationRoutes, ...deckRoutes];
}
