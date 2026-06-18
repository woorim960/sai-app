"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart, RefreshCw, Share2, Sparkles } from "lucide-react";
import {
  AnimatedBar,
  StaggerItem,
  useCountUp,
} from "@/components/together/compatibility-result-animations";
import {
  CoupleDeepReport,
  PersonalInsightsSection,
  ProfileChangeSection,
  isEnhancedReport,
} from "@/components/together/compatibility-result-sections";
import {
  COMPAT_TEST_META,
  DIMENSION_META,
  getPersonaAxisBadges,
  getProfilePersona,
  type CompatReport,
  type DimensionScores,
  type LoveProfile,
} from "@/lib/together/compatibility";
import type { LovePersona } from "@/lib/together/compatibility-personas";
import { loadCompatHistory } from "@/lib/together/compatibility-storage";
import { cn } from "@/lib/utils";

type ResultViewProps = {
  profile: LoveProfile;
  partnerProfile: LoveProfile | null;
  partnerName?: string;
  report: CompatReport | null;
  onShare: () => void;
  onReset: () => void;
};

export function CompatibilityResultView({
  profile,
  partnerProfile,
  partnerName,
  report,
  onShare,
  onReset,
}: ResultViewProps) {
  const persona = getProfilePersona(profile);
  const partnerPersona = partnerProfile
    ? getProfilePersona(partnerProfile)
    : null;
  const axisBadges = getPersonaAxisBadges(profile.scores);
  const isCouple = Boolean(report && partnerPersona);

  const previousProfile = useMemo(() => {
    const history = loadCompatHistory();
    return history[0]?.profile ?? null;
  }, [profile.persona, profile.scores]);

  const enhancedReport = isEnhancedReport(report) ? report : null;

  return (
    <div className="relative pb-2">
      <AmbientOrbs />

      {isCouple && report && partnerPersona ? (
        <CoupleHero
          report={report}
          persona={persona}
          partnerPersona={partnerPersona}
          partnerName={partnerName}
        />
      ) : (
        <SoloPersonaHero persona={persona} axisBadges={axisBadges} />
      )}

      {report && (report.strengths.length > 0 || report.growthAreas.length > 0) && (
        <InsightSnapshot
          strengths={report.strengths}
          growthAreas={report.growthAreas}
          className="fade-in-up-delay-1 mt-5"
        />
      )}

      {isCouple && (
        <PersonaStoryCard
          persona={persona}
          axisBadges={axisBadges}
          className="fade-in-up-delay-2 mt-5"
        />
      )}

      {!isCouple && (
        <div className="compat-card-3d fade-in-up-delay-2 mt-5 rounded-[22px] border border-dashed border-[#E5D8F0] bg-white/80 px-5 py-6 text-center backdrop-blur-sm">
          <span className="compat-float-gentle text-[36px]">💌</span>
          <p className="mt-3 text-[14px] font-bold text-sai-text">
            파트너 결과를 기다리고 있어요
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-sai-text-secondary">
            파트너도 검사하면 8차원 궁합 분석이 나와요
          </p>
        </div>
      )}

      <PersonalInsightsSection profile={profile} />

      {!isCouple && (
        <SoloDimensionCard scores={profile.scores} className="mt-5" />
      )}

      {previousProfile && (
        <ProfileChangeSection previous={previousProfile} current={profile} />
      )}

      {enhancedReport && <CoupleDeepReport report={enhancedReport} />}

      {!report && (
        <p className="compat-card-3d mt-5 rounded-[18px] bg-[#F8F6FF]/90 px-4 py-3.5 text-center text-[13px] leading-relaxed text-sai-text-secondary">
          <Sparkles className="mr-1 inline size-3.5 text-sai-primary" />
          {COMPAT_TEST_META.itemCount}문항 결과가 저장됐어요
        </p>
      )}

      <ActionButtons onReset={onReset} onShare={onShare} />
    </div>
  );
}

function AmbientOrbs() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-6 size-44 rounded-full bg-[#E8DEFF]/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-32 size-32 rounded-full bg-[#FFD6E8]/40 blur-3xl"
      />
    </>
  );
}

function CoupleHero({
  report,
  persona,
  partnerPersona,
  partnerName,
}: {
  report: CompatReport;
  persona: LovePersona;
  partnerPersona: LovePersona;
  partnerName?: string;
}) {
  return (
    <section className="compat-hero-3d fade-in-up relative overflow-hidden rounded-[28px] px-5 pb-7 pt-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F3EEFF] via-[#FFF5F8] to-[#F8F4FF]"
      />

      <div className="relative flex items-end justify-center gap-3">
        <PersonaOrb
          label="나"
          persona={persona}
          side="left"
          className="compat-orb-left"
        />
        <div className="compat-gauge-ring flex flex-col items-center px-1 pb-1">
          <CompatGauge score={report.score} />
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-[#9B8BBF]">
            우리 궁합
          </p>
          <p className="mt-1 text-[15px] font-bold text-sai-text">
            {report.headline}
          </p>
        </div>
        <PersonaOrb
          label={partnerName ?? "파트너"}
          persona={partnerPersona}
          side="right"
          className="compat-orb-right"
        />
      </div>

      <p className="relative mt-5 text-center text-[13px] leading-relaxed text-sai-text-secondary">
        {report.message}
      </p>
    </section>
  );
}

function SoloPersonaHero({
  persona,
  axisBadges,
}: {
  persona: LovePersona;
  axisBadges: string[];
}) {
  return (
    <section className="compat-hero-3d fade-in-up relative overflow-hidden rounded-[28px] px-6 py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F3EEFF] via-[#FFFBFC] to-[#F0F8FF]"
      />
      <div className="relative text-center">
        <div className="compat-gauge-ring mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-white to-[#F8F4FF] text-[48px] shadow-[0_12px_32px_rgba(145,129,244,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)] ring-4 ring-white/80">
          <span className="compat-float-gentle">{persona.emoji}</span>
        </div>
        <p className="mt-4 text-[11px] font-bold tracking-wide text-[#9B8BBF]">
          {persona.code}
        </p>
        <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-sai-text">
          {persona.title}
        </h2>
        <p className="mt-2 text-[13px] text-sai-text-secondary">
          {persona.tagline}
        </p>
        <p className="mt-4 text-left text-[14px] leading-[1.65] text-sai-text-secondary">
          {persona.description}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {axisBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[#F0EBF5] bg-white/80 px-2.5 py-1 text-[10px] font-medium text-sai-text-secondary"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {persona.traits.map((trait, i) => (
            <StaggerItem key={trait} index={i}>
              <span className="inline-block rounded-full bg-gradient-to-r from-[#F4F1FE] to-[#EDE8FF] px-3 py-1.5 text-[12px] font-semibold text-sai-primary">
                {trait}
              </span>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 커플 모드: 히어로에 없는 '내 유형' 스토리만 (제목·이모지 중복 제거) */
function PersonaStoryCard({
  persona,
  axisBadges,
  className,
}: {
  persona: LovePersona;
  axisBadges: string[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "compat-card-3d rounded-[22px] border border-white/60 bg-white/90 p-5 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-[12px] font-bold text-sai-primary">내 유형 이야기</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {axisBadges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-[#F0EBF5] bg-[#FAF8FC] px-2.5 py-1 text-[10px] font-medium text-sai-text-secondary"
          >
            {badge}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[14px] leading-[1.65] text-sai-text-secondary">
        {persona.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {persona.traits.map((trait, i) => (
          <StaggerItem key={trait} index={i}>
            <span className="inline-block rounded-full bg-gradient-to-r from-[#F4F1FE] to-[#EDE8FF] px-3 py-1.5 text-[12px] font-semibold text-sai-primary">
              {trait}
            </span>
          </StaggerItem>
        ))}
      </div>
    </section>
  );
}

function CompatGauge({ score }: { score: number }) {
  const animated = useCountUp(score);
  const rotation = (animated / 100) * 360;

  return (
    <div className="relative size-[88px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E8DEFF] to-[#FFD6E8] opacity-60 blur-sm" />
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: `conic-gradient(from -90deg, #C4A8FF 0deg, #FF9EC0 ${rotation}deg, #F0E8F4 ${rotation}deg 360deg)`,
          boxShadow:
            "inset 0 2px 8px rgba(255,255,255,0.6), 0 8px 24px rgba(145,129,244,0.2)",
        }}
      />
      <div className="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-gradient-to-b from-white to-[#FAF8FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <span className="text-[26px] font-extrabold leading-none text-sai-text">
          {animated}
        </span>
        <span className="text-[11px] font-bold text-[#E86B96]">%</span>
      </div>
    </div>
  );
}

function PersonaOrb({
  label,
  persona,
  side,
  className,
}: {
  label: string;
  persona: LovePersona;
  side: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        side === "left" ? "-rotate-2" : "rotate-2",
        className
      )}
    >
      <div
        className={cn(
          "flex size-[72px] items-center justify-center rounded-[22px] text-[32px] shadow-[0_10px_28px_rgba(145,129,244,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] ring-2 ring-white/90",
          side === "left"
            ? "bg-gradient-to-br from-[#F4F1FE] to-white"
            : "bg-gradient-to-br from-[#FFF0F5] to-white"
        )}
      >
        <span className="compat-float-gentle">{persona.emoji}</span>
      </div>
      <p className="mt-2 text-[10px] font-bold text-[#9B8BBF]">{label}</p>
      <p className="mt-0.5 max-w-[88px] text-center text-[11px] font-bold leading-tight text-sai-text">
        {persona.title}
      </p>
    </div>
  );
}

function InsightSnapshot({
  strengths,
  growthAreas,
  className,
}: {
  strengths: string[];
  growthAreas: string[];
  className?: string;
}) {
  return (
    <section className={cn("grid gap-3", className)}>
      {strengths.length > 0 && (
        <div className="compat-card-3d rounded-[20px] border border-[#D4EDE4]/80 bg-gradient-to-br from-[#F6FDF9] to-white p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#2A9D6A]">
            <Heart className="size-3.5 fill-[#2A9D6A]/20" strokeWidth={2.2} />
            잘 맞는 점
          </p>
          <ul className="mt-2.5 space-y-2">
            {strengths.map((item, i) => (
              <StaggerItem key={item} index={i}>
                <li className="flex gap-2 text-[13px] leading-relaxed text-sai-text-secondary">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#6BC9A0]" />
                  {item}
                </li>
              </StaggerItem>
            ))}
          </ul>
        </div>
      )}
      {growthAreas.length > 0 && (
        <div className="compat-card-3d rounded-[20px] border border-[#FFE0D4]/80 bg-gradient-to-br from-[#FFFBF9] to-white p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#D4846A]">
            <Sparkles className="size-3.5 text-[#D4846A]" strokeWidth={2.2} />
            대화하면 좋은 점
          </p>
          <ul className="mt-2.5 space-y-2">
            {growthAreas.map((item, i) => (
              <StaggerItem key={item} index={i}>
                <li className="flex gap-2 text-[13px] leading-relaxed text-sai-text-secondary">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#E8A88A]" />
                  {item}
                </li>
              </StaggerItem>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function SoloDimensionCard({
  scores,
  className,
}: {
  scores: DimensionScores;
  className?: string;
}) {
  const dimensions = Object.keys(DIMENSION_META) as (keyof typeof DIMENSION_META)[];

  return (
    <section
      className={cn(
        "compat-card-3d rounded-[22px] border border-white/60 bg-white/90 p-5 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-[15px] font-bold text-sai-text">8차원 프로필</p>
      <p className="mt-0.5 text-[11px] text-sai-text-secondary">
        나의 연애 성향 한눈에 보기
      </p>
      <div className="mt-4 space-y-3.5">
        {dimensions.map((dim, i) => {
          const meta = DIMENSION_META[dim];
          const value = scores[dim];
          const pct = Math.round(((value + 100) / 200) * 100);

          return (
            <StaggerItem key={dim} index={i}>
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-sai-text">{meta.label}</span>
                  <span className="text-sai-text-secondary">
                    {value >= 0 ? meta.highLabel : meta.lowLabel}
                  </span>
                </div>
                <div className="mt-1.5">
                  <AnimatedBar pct={pct} delayMs={i * 60} />
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </div>
    </section>
  );
}

function ActionButtons({
  onReset,
  onShare,
}: {
  onReset: () => void;
  onShare: () => void;
}) {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onReset}
          className="compat-btn-ghost flex items-center justify-center gap-2 rounded-[18px] py-3.5 text-[14px] font-bold text-sai-text active:scale-[0.98]"
        >
          <RefreshCw className="size-4" strokeWidth={2.2} />
          다시하기
        </button>
        <button
          type="button"
          onClick={onShare}
          className="compat-btn-primary flex items-center justify-center gap-2 rounded-[18px] py-3.5 text-[14px] font-bold text-white active:scale-[0.98]"
        >
          <Share2 className="size-4" strokeWidth={2.2} />
          결과 공유
        </button>
      </div>
      <Link
        href="/together"
        className="mt-3 block rounded-[16px] py-3 text-center text-[13px] font-semibold text-sai-text-secondary active:scale-[0.99]"
      >
        둘이하기로 돌아가기
      </Link>
    </>
  );
}
