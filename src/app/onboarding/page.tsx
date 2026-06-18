import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { onboardingSlides } from "@/lib/data";

type OnboardingPageProps = {
  searchParams: Promise<{ step?: string }>;
};

function parseStep(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(parsed - 1, 0), onboardingSlides.length - 1);
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { step } = await searchParams;
  return <OnboardingScreen step={parseStep(step)} />;
}
