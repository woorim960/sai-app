"use client";

import { useEffect, useState } from "react";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { HomeHeader } from "@/components/home/home-header";
import { HomeHero } from "@/components/home/home-hero";
import { HomeContextFilter } from "@/components/home/home-context-filter";
import { FeaturedDeckCarousel } from "@/components/home/featured-deck-carousel";
import { HomeQuickThemeChips } from "@/components/home/home-quick-theme-chips";
import { PopularGameScroll } from "@/components/home/popular-game-scroll";
import { HOME_CONTEXTS } from "@/lib/data/home";
import {
  registerHomeDeckClick,
  trackHomeExperimentEvent,
} from "@/lib/home-experiment";

const HOME_CONTEXT_KEY = "sai_home_context";
const HOME_AB_KEY = "sai_home_ab_variant";
type HomeVariant = "A" | "B";

function resolveInitialContext(
  initialContextId?: string,
  savedContext?: string | null
): string {
  if (
    initialContextId &&
    HOME_CONTEXTS.some((item) => item.id === initialContextId)
  ) {
    return initialContextId;
  }
  if (savedContext && HOME_CONTEXTS.some((item) => item.id === savedContext)) {
    return savedContext;
  }
  return HOME_CONTEXTS[0]?.id ?? "couple";
}

type HomeScreenProps = {
  initialContextId?: string;
};

export function HomeScreen({ initialContextId }: HomeScreenProps) {
  const [contextId, setContextId] = useState(() =>
    resolveInitialContext(initialContextId)
  );
  const [variant, setVariant] = useState<HomeVariant>("A");

  useEffect(() => {
    if (initialContextId) return;
    const saved = localStorage.getItem(HOME_CONTEXT_KEY);
    if (!saved) return;
    setContextId(resolveInitialContext(undefined, saved));
  }, [initialContextId]);

  useEffect(() => {
    localStorage.setItem(HOME_CONTEXT_KEY, contextId);
  }, [contextId]);

  useEffect(() => {
    const saved = localStorage.getItem(HOME_AB_KEY);
    if (saved === "A" || saved === "B") {
      setVariant(saved);
      return;
    }
    const assigned: HomeVariant = Math.random() < 0.5 ? "A" : "B";
    setVariant(assigned);
    localStorage.setItem(HOME_AB_KEY, assigned);
  }, []);

  useEffect(() => {
    trackHomeExperimentEvent(variant, "home_view");
  }, [variant]);

  return (
    <AppTabShell className="page-enter bg-[#FAFAFC]">
      <HomeHeader />
      <HomeHero />
      <HomeContextFilter
        value={contextId}
        onChange={(nextContext) => {
          setContextId(nextContext);
          trackHomeExperimentEvent(variant, "context_change");
        }}
      />
      <HomeQuickThemeChips
        onThemeClick={() =>
          trackHomeExperimentEvent(variant, "quick_theme_click")
        }
      />
      <FeaturedDeckCarousel
        contextId={contextId}
        variant={variant}
        onFeaturedClick={(deckId) =>
          registerHomeDeckClick(variant, "featured", deckId)
        }
      />
      <PopularGameScroll
        contextId={contextId}
        onPopularClick={(deckId) =>
          registerHomeDeckClick(variant, "popular", deckId)
        }
      />
    </AppTabShell>
  );
}
