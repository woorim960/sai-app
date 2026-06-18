import { Check, Clock, PartyPopper, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderParticipant = {
  displayName: string;
  completed: boolean;
  isMe?: boolean;
};

type ResultPageHeaderProps = {
  deckTitle: string;
  statusLabel: string;
  expiresLabel: string;
  comparisonReady?: boolean;
  participants?: HeaderParticipant[];
  isSync?: boolean;
};

const AVATAR_COLORS = [
  "from-[#E8DEFF] to-[#D4C4FF]",
  "from-[#D4F5E4] to-[#A8E6C8]",
  "from-[#FFE8E0] to-[#FFCDB8]",
  "from-[#E0F0FF] to-[#B8D4FF]",
  "from-[#FFF0C2] to-[#FFE08A]",
];

export function ResultPageHeader({
  deckTitle,
  statusLabel,
  expiresLabel,
  comparisonReady,
  participants = [],
  isSync,
}: ResultPageHeaderProps) {
  const visible = participants.slice(0, 5);
  const overflow = participants.length - visible.length;

  return (
    <header className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-[#F5F0FF] via-white to-[#EDFFF5] px-5 py-6 shadow-[0_12px_40px_rgba(145,129,244,0.15)]">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full bg-[#B6A9FF]/30 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-6 size-32 rounded-full bg-[#6DD4A8]/25 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-10 top-6 size-16 rounded-full bg-[#FFD4B8]/40 blur-xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 size-24 -translate-x-1/2 rounded-full bg-[#F0EDFF]/60 blur-xl"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm",
              comparisonReady
                ? "bg-gradient-to-r from-[#8576FF] to-[#A89EFF] text-white"
                : "bg-white text-sai-primary"
            )}
          >
            {comparisonReady ? (
              <PartyPopper className="size-3.5" strokeWidth={2.5} />
            ) : isSync ? (
              <Users className="size-3.5" strokeWidth={2.5} />
            ) : (
              <Sparkles className="size-3.5" strokeWidth={2.5} />
            )}
            {comparisonReady
              ? "결과가 나왔어요!"
              : isSync
                ? "함께하기 결과"
                : "플레이 결과"}
          </span>
        </div>

        <h1 className="mt-3 text-[28px] font-extrabold leading-[1.2] tracking-[-0.03em] text-sai-text">
          {deckTitle}
        </h1>

        {comparisonReady && (
          <p className="mt-2 text-[14px] font-medium text-sai-text-secondary">
            {isSync
              ? "🎉 함께한 선택, 이제 비교해볼까요?"
              : "✨ 선택 비교가 준비됐어요"}
          </p>
        )}

        {visible.length > 0 && (
          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {visible.map((participant, index) => (
                <span
                  key={`${participant.displayName}-${index}`}
                  title={participant.displayName}
                  className="relative inline-flex"
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-[14px] font-bold text-sai-primary shadow-[0_2px_8px_rgba(145,129,244,0.2)]",
                      AVATAR_COLORS[index % AVATAR_COLORS.length],
                      participant.isMe && "ring-2 ring-sai-primary/40 ring-offset-2 ring-offset-white"
                    )}
                  >
                    {participant.displayName.slice(0, 1)}
                  </span>
                  {participant.completed && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-[#34C759] shadow-sm">
                      <Check className="size-2.5 text-white" strokeWidth={3.5} />
                    </span>
                  )}
                </span>
              ))}
              {overflow > 0 && (
                <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#F0EDFF] text-[11px] font-bold text-sai-primary shadow-sm">
                  +{overflow}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-sm",
              comparisonReady
                ? "bg-[#E8F8F0] text-[#2A9D6A]"
                : "bg-[#F0EDFF] text-sai-primary"
            )}
          >
            {statusLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-medium text-sai-text-secondary shadow-sm backdrop-blur-sm">
            <Clock className="size-3.5 text-sai-primary/70" strokeWidth={2.2} />
            {expiresLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
