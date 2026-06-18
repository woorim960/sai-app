export type HomeVariant = "A" | "B";
export type HomeClickSource = "featured" | "popular";

export type HomeExperimentEvent =
  | "home_view"
  | "featured_click"
  | "popular_click"
  | "quick_theme_click"
  | "context_change"
  | "deck_detail_view"
  | "play_start_async"
  | "play_start_sync";

type VariantMetrics = {
  views: number;
  featuredClicks: number;
  popularClicks: number;
  quickThemeClicks: number;
  contextChanges: number;
  deckDetailViews: number;
  asyncStarts: number;
  syncStarts: number;
};

type HomeExperimentMetrics = {
  A: VariantMetrics;
  B: VariantMetrics;
};

const STORAGE_KEY = "sai_home_experiment_metrics";
const CHANGE_EVENT = "sai-home-experiment-metrics-changed";
const PENDING_CLICK_KEY = "sai_home_experiment_pending_click";
const ACTIVE_ATTRIBUTION_KEY = "sai_home_experiment_active_deck";
const TTL_MS = 20 * 60 * 1000;

const EMPTY_VARIANT: VariantMetrics = {
  views: 0,
  featuredClicks: 0,
  popularClicks: 0,
  quickThemeClicks: 0,
  contextChanges: 0,
  deckDetailViews: 0,
  asyncStarts: 0,
  syncStarts: 0,
};

const EMPTY_METRICS: HomeExperimentMetrics = {
  A: { ...EMPTY_VARIANT },
  B: { ...EMPTY_VARIANT },
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readMetrics(): HomeExperimentMetrics {
  if (!isBrowser()) return EMPTY_METRICS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_METRICS;

  try {
    const parsed = JSON.parse(raw) as Partial<HomeExperimentMetrics>;
    return {
      A: { ...EMPTY_VARIANT, ...(parsed.A ?? {}) },
      B: { ...EMPTY_VARIANT, ...(parsed.B ?? {}) },
    };
  } catch {
    return EMPTY_METRICS;
  }
}

function writeMetrics(metrics: HomeExperimentMetrics): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function mutateVariant(
  metrics: HomeExperimentMetrics,
  variant: HomeVariant,
  updater: (metrics: VariantMetrics) => VariantMetrics
): HomeExperimentMetrics {
  return {
    ...metrics,
    [variant]: updater(metrics[variant]),
  };
}

export function trackHomeExperimentEvent(
  variant: HomeVariant,
  event: HomeExperimentEvent
): void {
  if (!isBrowser()) return;
  const current = readMetrics();

  const next = mutateVariant(current, variant, (item) => {
    if (event === "home_view") return { ...item, views: item.views + 1 };
    if (event === "featured_click") {
      return { ...item, featuredClicks: item.featuredClicks + 1 };
    }
    if (event === "popular_click") {
      return { ...item, popularClicks: item.popularClicks + 1 };
    }
    if (event === "quick_theme_click") {
      return { ...item, quickThemeClicks: item.quickThemeClicks + 1 };
    }
    if (event === "deck_detail_view") {
      return { ...item, deckDetailViews: item.deckDetailViews + 1 };
    }
    if (event === "play_start_async") {
      return { ...item, asyncStarts: item.asyncStarts + 1 };
    }
    if (event === "play_start_sync") {
      return { ...item, syncStarts: item.syncStarts + 1 };
    }
    return { ...item, contextChanges: item.contextChanges + 1 };
  });

  writeMetrics(next);
}

export function getHomeExperimentMetrics(): HomeExperimentMetrics {
  return readMetrics();
}

export function getHomeExperimentChangeEventName(): string {
  return CHANGE_EVENT;
}

type PendingClick = {
  variant: HomeVariant;
  source: HomeClickSource;
  deckId: string;
  at: number;
};

type ActiveDeckAttribution = {
  variant: HomeVariant;
  deckId: string;
  at: number;
};

function readPendingClick(): PendingClick | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(PENDING_CLICK_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingClick;
    if (!parsed.deckId || !parsed.variant || !parsed.source || !parsed.at) {
      return null;
    }
    if (Date.now() - parsed.at > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function registerHomeDeckClick(
  variant: HomeVariant,
  source: HomeClickSource,
  deckId: string
): void {
  trackHomeExperimentEvent(
    variant,
    source === "featured" ? "featured_click" : "popular_click"
  );

  if (!isBrowser()) return;
  const pending: PendingClick = {
    variant,
    source,
    deckId,
    at: Date.now(),
  };
  localStorage.setItem(PENDING_CLICK_KEY, JSON.stringify(pending));
}

export function consumePendingHomeDeckClick(
  deckId: string
): { variant: HomeVariant; source: HomeClickSource } | null {
  if (!isBrowser()) return null;
  const pending = readPendingClick();
  localStorage.removeItem(PENDING_CLICK_KEY);
  if (!pending) return null;
  if (pending.deckId !== deckId) return null;

  const active: ActiveDeckAttribution = {
    variant: pending.variant,
    deckId,
    at: Date.now(),
  };
  localStorage.setItem(ACTIVE_ATTRIBUTION_KEY, JSON.stringify(active));
  trackHomeExperimentEvent(pending.variant, "deck_detail_view");
  return { variant: pending.variant, source: pending.source };
}

export function getActiveDeckAttribution(
  deckId: string
): { variant: HomeVariant } | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(ACTIVE_ATTRIBUTION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ActiveDeckAttribution;
    if (!parsed.deckId || !parsed.variant || !parsed.at) return null;
    if (parsed.deckId !== deckId) return null;
    if (Date.now() - parsed.at > TTL_MS) return null;
    return { variant: parsed.variant };
  } catch {
    return null;
  }
}
