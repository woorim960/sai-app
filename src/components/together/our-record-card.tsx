import { Calendar, Clock, Gamepad2, Flame } from "lucide-react";
import type { CoupleMemberPublic } from "@/lib/couple/types";
import type { TogetherStats } from "@/lib/together/dashboard";
import { daysSinceAnniversary, formatDuration } from "@/lib/together/dashboard";

type OurRecordCardProps = {
  stats: TogetherStats;
  members: CoupleMemberPublic[];
  coupleName?: string;
  anniversary?: string;
  paired: boolean;
};

export function OurRecordCard({
  stats,
  members,
  coupleName,
  anniversary,
  paired,
}: OurRecordCardProps) {
  const leftEmoji = members[0]?.emoji ?? "🐧";
  const rightEmoji = members[1]?.emoji ?? "🐤";
  const title = coupleName?.trim() || "우리의 기록";
  const dday = daysSinceAnniversary(anniversary);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#7B6CF6] via-[#9181F4] to-[#B6A9FF] p-6 text-white shadow-[0_16px_40px_rgba(118,99,234,0.35)]">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-16 size-48 rounded-full bg-white/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-white/10"
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-white/80">
            {paired ? "함께 쌓은 기록" : "나의 기록"}
          </p>
          <h2 className="mt-0.5 truncate text-[20px] font-bold tracking-[-0.02em]">
            {title}
          </h2>

          {dday !== null && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-bold">
              <Calendar className="size-3.5" strokeWidth={2.2} />
              함께한 지 {dday}일
            </span>
          )}

          <dl className="mt-5 space-y-3">
            <Stat
              icon={<Clock className="size-4" strokeWidth={2.2} />}
              label="함께한 시간"
              value={formatDuration(stats.totalMinutes)}
            />
            <Stat
              icon={<Gamepad2 className="size-4" strokeWidth={2.2} />}
              label="완료한 게임"
              value={`${stats.totalCount}개`}
            />
          </dl>
        </div>

        <CoupleAvatars
          leftEmoji={leftEmoji}
          rightEmoji={rightEmoji}
          paired={paired}
        />
      </div>

      <div className="relative z-10 mt-6 rounded-[18px] bg-white/15 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-bold">
            Lv.{stats.level} · {stats.levelLabel}
          </span>
          {stats.streakDays > 0 && (
            <span className="inline-flex items-center gap-1 text-white/90">
              <Flame className="size-3.5" strokeWidth={2.4} />
              {stats.streakDays}일 연속
            </span>
          )}
        </div>

        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${stats.intimacy}%` }}
          />
        </div>
        <p className="mt-2 text-[11.5px] text-white/85">
          {stats.toNextLevel > 0
            ? `${stats.toNextLevel}번 더 플레이하면 다음 단계로 올라가요`
            : "최고 친밀도에 도달했어요!"}
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
        {icon}
      </span>
      <dt className="text-[12.5px] text-white/80">{label}</dt>
      <dd className="ml-auto text-[16px] font-bold">{value}</dd>
    </div>
  );
}

function CoupleAvatars({
  leftEmoji,
  rightEmoji,
  paired,
}: {
  leftEmoji: string;
  rightEmoji: string;
  paired: boolean;
}) {
  return (
    <div className="relative flex shrink-0 items-end">
      <span className="flex size-14 items-center justify-center rounded-full bg-white/85 text-[28px] shadow-[0_6px_16px_rgba(45,49,66,0.18)]">
        {leftEmoji}
      </span>
      <span className="z-10 -mx-2 mb-6 text-[15px]">❤️</span>
      <span
        className={
          paired
            ? "flex size-14 items-center justify-center rounded-full bg-white/85 text-[28px] shadow-[0_6px_16px_rgba(45,49,66,0.18)]"
            : "flex size-14 items-center justify-center rounded-full border-2 border-dashed border-white/60 bg-white/15 text-[24px]"
        }
      >
        {paired ? rightEmoji : "＋"}
      </span>
    </div>
  );
}
