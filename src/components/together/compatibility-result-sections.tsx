"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
  buildPersonalReport,
  compareProfileChanges,
  getAttachmentMeta,
  type EnhancedCompatReport,
  type LoveProfile,
  type ProfileChange,
} from "@/lib/together/compatibility";
import { AnimatedBar, StaggerItem } from "@/components/together/compatibility-result-animations";
import { cn } from "@/lib/utils";

/** 애착 스타일 + 개인 강점/주의 (페르소나·차원 중복 제외) */
export function PersonalInsightsSection({ profile }: { profile: LoveProfile }) {
  const report = buildPersonalReport(profile);
  const attachment = getAttachmentMeta(report.attachmentStyle);

  return (
    <section className="mt-5 space-y-3">
      <div className="compat-card-3d insight-enter-1 rounded-[20px] border border-[#E5E1FA] bg-gradient-to-br from-[#FAF8FF] to-white p-4">
        <p className="text-[12px] font-bold text-sai-primary">애착 스타일</p>
        <div className="mt-3 flex items-start gap-2.5 rounded-[14px] bg-white/80 px-3 py-2.5">
          <span className="compat-float-gentle text-[22px]">{attachment.emoji}</span>
          <div>
            <p className="text-[13px] font-bold text-sai-text">
              {report.attachmentLabel}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-sai-text-secondary">
              {report.attachmentDescription}
            </p>
          </div>
        </div>
      </div>

      {report.strengths.length > 0 && (
        <InsightListCard
          title="나의 강점"
          tone="positive"
          items={report.strengths}
          className="insight-enter-2"
        />
      )}

      {report.cautions.length > 0 && (
        <InsightListCard
          title="관계에서 주의할 점"
          tone="caution"
          items={report.cautions}
          className="insight-enter-3"
        />
      )}
    </section>
  );
}

function InsightListCard({
  title,
  tone,
  items,
  className,
}: {
  title: string;
  tone: "positive" | "caution";
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "compat-card-3d rounded-[18px] border p-4",
        tone === "positive"
          ? "border-[#D4F0E4] bg-[#F6FDF9]"
          : "border-[#FFE8E0] bg-[#FFFBF9]",
        className
      )}
    >
      <p
        className={cn(
          "text-[12px] font-bold",
          tone === "positive" ? "text-[#2A9D6A]" : "text-[#E07A5F]"
        )}
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <StaggerItem key={item} index={i}>
            <li className="text-[13px] text-sai-text-secondary">· {item}</li>
          </StaggerItem>
        ))}
      </ul>
    </div>
  );
}

/** 커플 심화: 차원 비교 + 상황별 조언 (점수 분해·8차원 바 중복 제거) */
export function CoupleDeepReport({ report }: { report: EnhancedCompatReport }) {
  return (
    <section className="mt-5 space-y-3">
      <DimensionComparisonCard comparisons={report.comparisons} />
      <ScenarioAdviceCard scenarios={report.scenarios} />
    </section>
  );
}

function DimensionComparisonCard({
  comparisons,
}: {
  comparisons: EnhancedCompatReport["comparisons"];
}) {
  const statusStyle = {
    similar: "bg-[#E8F8EF] text-[#2A9D6A]",
    moderate: "bg-[#FFF4E6] text-[#D97706]",
    different: "bg-[#FFF0F5] text-[#E86B96]",
  } as const;

  const statusLabel = {
    similar: "비슷함",
    moderate: "적당한 차이",
    different: "차이 큼",
  } as const;

  return (
    <div className="compat-card-3d fade-in-up-delay-1 rounded-[20px] border border-[#ECE2EF] bg-white p-4">
      <p className="text-[14px] font-bold text-sai-text">8차원 비교</p>
      <p className="mt-0.5 text-[11px] text-sai-text-secondary">
        나 vs 파트너 · 격차와 해석 한눈에
      </p>
      <div className="mt-3 space-y-2">
        {comparisons.map((item, i) => {
          const similarity = Math.round(
            (1 - Math.min(1, item.gap / 200)) * 100
          );

          return (
            <StaggerItem key={item.dimension} index={i}>
              <div className="rounded-[14px] border border-[#F3EEF5] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-sai-text">
                    {item.label}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      statusStyle[item.status]
                    )}
                  >
                    {statusLabel[item.status]}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-[10px] text-sai-text-secondary">
                    <span>유사도 {similarity}%</span>
                    <span>
                      나 {item.mine > 0 ? "+" : ""}
                      {item.mine} · 파트너 {item.partner > 0 ? "+" : ""}
                      {item.partner}
                    </span>
                  </div>
                  <AnimatedBar
                    pct={similarity}
                    delayMs={i * 70}
                    tone="pink"
                  />
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-sai-text-secondary">
                  {item.note}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioAdviceCard({
  scenarios,
}: {
  scenarios: EnhancedCompatReport["scenarios"];
}) {
  return (
    <div className="compat-card-3d fade-in-up-delay-2 rounded-[20px] border border-[#E5E1FA] bg-[#FAF8FF] p-4">
      <p className="text-[14px] font-bold text-sai-text">상황별 조언</p>
      <p className="mt-0.5 text-[11px] text-sai-text-secondary">
        실전에서 바로 써볼 수 있는 팁
      </p>
      <div className="mt-3 space-y-2.5">
        {scenarios.map((item, i) => (
          <StaggerItem key={item.id} index={i}>
            <div className="rounded-[14px] bg-white px-3.5 py-3 shadow-sm">
              <p className="text-[12px] font-bold text-sai-text">
                <span className="compat-float-gentle mr-1 inline-block">
                  {item.emoji}
                </span>
                {item.title}
              </p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-sai-text-secondary">
                {item.advice}
              </p>
            </div>
          </StaggerItem>
        ))}
      </div>
    </div>
  );
}

export function ProfileChangeSection({
  previous,
  current,
}: {
  previous: LoveProfile;
  current: LoveProfile;
}) {
  const changes = compareProfileChanges(previous, current);
  if (changes.length === 0) return null;

  return (
    <div className="compat-card-3d mt-5 rounded-[20px] border border-[#D4E8FF] bg-[#F5FAFF] p-4">
      <p className="text-[14px] font-bold text-sai-text">재검사 변화</p>
      <p className="mt-0.5 text-[11px] text-sai-text-secondary">
        이전 결과와 비교한 주요 변화
      </p>
      <div className="mt-3 space-y-2">
        {changes.map((item, i) => (
          <StaggerItem key={item.dimension} index={i}>
            <ChangeRow change={item} />
          </StaggerItem>
        ))}
      </div>
    </div>
  );
}

function ChangeRow({ change }: { change: ProfileChange }) {
  const Icon =
    change.trend === "up" ? ArrowUp : change.trend === "down" ? ArrowDown : Minus;
  const trendColor =
    change.trend === "up"
      ? "text-[#2A9D6A]"
      : change.trend === "down"
        ? "text-[#E07A5F]"
        : "text-sai-text-secondary";

  return (
    <div className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2.5">
      <div>
        <p className="text-[12px] font-bold text-sai-text">{change.label}</p>
        <p className="mt-0.5 text-[10px] text-sai-text-secondary">
          {change.previous} → {change.current}
        </p>
      </div>
      <div className={cn("flex items-center gap-1 text-[12px] font-bold", trendColor)}>
        <Icon className="size-3.5" strokeWidth={2.5} />
        {change.delta > 0 ? "+" : ""}
        {change.delta}
      </div>
    </div>
  );
}

export function isEnhancedReport(
  report: unknown
): report is EnhancedCompatReport {
  return (
    typeof report === "object" &&
    report !== null &&
    "breakdown" in report &&
    "comparisons" in report &&
    "scenarios" in report
  );
}

// 하위 호환 export
export { PersonalInsightsSection as PersonalReportSection };
export { CoupleDeepReport as CoupleReportSections };
