"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  LOVE_TYPES,
  buildPersonalReport,
  formatFullTypeLabel,
  getAttachmentMeta,
  getProfilePersona,
  type LoveTypeId,
} from "@/lib/together/compatibility";
import type { CompatSnapshot } from "@/lib/together/compatibility-results";
import { cn } from "@/lib/utils";

type CompatResultsCardProps = {
  snapshot: CompatSnapshot;
  paired: boolean;
  className?: string;
};

export function CompatResultsCard({
  snapshot,
  paired,
  className,
}: CompatResultsCardProps) {
  const { mine, partner, partnerName, report } = snapshot;

  if (!mine) {
    return (
      <Link
        href="/together/compatibility"
        className={cn(
          "relative flex items-center gap-4 overflow-hidden rounded-[22px] bg-gradient-to-r from-[#FF8FB1] via-[#FF9EC0] to-[#FFB6D2] p-5 text-white shadow-[0_10px_28px_rgba(255,143,177,0.32)] transition-all active:scale-[0.99]",
          className
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-white/15"
        />
        <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-white/25 text-[26px]">
          💘
        </span>
        <div className="relative z-10 min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-white/85">
            우리 궁합이 궁금하다면?
          </p>
          <p className="mt-0.5 text-[16px] font-bold">연애 궁합 심리테스트</p>
        </div>
        <ChevronRight className="relative z-10 size-5 shrink-0 text-white/90" />
      </Link>
    );
  }

  const myPersona = mine.profile ? getProfilePersona(mine.profile) : null;
  const partnerType = partner ? LOVE_TYPES[partner.loveTypeId] : null;
  const partnerPersona = partner?.profile
    ? getProfilePersona(partner.profile)
    : null;
  const myReport = mine.profile ? buildPersonalReport(mine.profile) : null;
  const myAttachment = myReport
    ? getAttachmentMeta(myReport.attachmentStyle)
    : null;

  return (
    <Link
      href="/together/compatibility"
      className={cn(
        "block rounded-[22px] border border-[#F5D0E0] bg-white p-4 shadow-[0_6px_22px_rgba(255,143,177,0.12)] transition-all active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-[#E86B96]">연애 궁합 결과</p>
            <p className="mt-0.5 text-[15px] font-bold text-sai-text">
              {report
                ? `우리 궁합 ${report.score}%`
                : myPersona
                  ? myPersona.title
                  : "내 연애 프로필"}
            </p>
            {report?.headline && (
              <p className="mt-0.5 text-[12px] text-sai-text-secondary">
                {report.headline}
              </p>
            )}
        </div>
        {report && (
          <span className="rounded-full bg-gradient-to-r from-[#FF8FB1] to-[#FFB6D2] px-3 py-1.5 text-[13px] font-extrabold text-white">
            {report.score}%
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <ProfileResultPill
          label="나"
          typeId={mine.loveTypeId}
          personaTitle={myPersona?.title}
          personaEmoji={myPersona?.emoji}
          subtype={myReport?.subtype}
          attachmentEmoji={myAttachment?.emoji}
        />
        {partnerType ? (
          <ProfileResultPill
            label={partnerName ?? "파트너"}
            typeId={partnerType.id}
            personaTitle={partnerPersona?.title}
            personaEmoji={partnerPersona?.emoji}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#ECE2EF] bg-[#FAF8FC] px-2 py-3 text-center">
            <span className="text-[20px]">💌</span>
            <p className="mt-1 text-[11px] font-semibold leading-tight text-sai-text-secondary">
              {paired ? "파트너 결과 대기" : "파트너 연결 후 비교"}
            </p>
          </div>
        )}
      </div>

      {myPersona && mine.profile && (
        <p className="mt-2.5 text-[11px] text-sai-text-secondary">
          {formatFullTypeLabel(mine.profile)}
          {myAttachment ? ` · ${myAttachment.label}` : ""}
        </p>
      )}

      {report && (
        <p className="mt-3 text-[12px] font-medium text-sai-text-secondary">
          {report.headline} · 자세히 보기
          <ChevronRight className="ml-0.5 inline size-3.5" strokeWidth={2.4} />
        </p>
      )}

      {!partner && (
        <p className="mt-3 rounded-[12px] bg-[#FFF4F8] px-3 py-2 text-[12px] text-sai-text-secondary">
          {paired
            ? "파트너도 테스트하면 둘의 궁합 점수가 나와요"
            : "파트너와 연결하고 테스트하면 궁합 점수를 볼 수 있어요"}
        </p>
      )}
    </Link>
  );
}

function ProfileResultPill({
  label,
  typeId,
  personaTitle,
  personaEmoji,
  subtype,
  attachmentEmoji,
}: {
  label: string;
  typeId: LoveTypeId;
  personaTitle?: string;
  personaEmoji?: string;
  subtype?: string;
  attachmentEmoji?: string;
}) {
  const type = LOVE_TYPES[typeId];
  const displayTitle = personaTitle ?? type.title;
  const displayEmoji = personaEmoji ?? type.emoji;

  return (
    <div className="rounded-[16px] bg-[#FAF8FF] px-3 py-3 text-center">
      <p className="text-[10px] font-bold text-sai-primary">{label}</p>
      <span className="mt-1 block text-[24px]">{displayEmoji}</span>
      <p className="mt-1 text-[12px] font-bold leading-tight text-sai-text">
        {displayTitle}
      </p>
      {subtype && (
        <p className="mt-0.5 text-[10px] leading-tight text-sai-text-secondary">
          {subtype}
          {attachmentEmoji ? ` ${attachmentEmoji}` : ""}
        </p>
      )}
    </div>
  );
}
