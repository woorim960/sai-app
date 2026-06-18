import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ParticipantAvatarItem = {
  clientId: string;
  displayName: string;
  isMe?: boolean;
  status?: "playing" | "completed";
};

type ParticipantAvatarsProps = {
  participants: ParticipantAvatarItem[];
  max?: number;
  className?: string;
};

const AVATAR_COLORS = [
  "from-[#8576ff] to-[#a89eff]",
  "from-[#ffb4b4] to-[#ffd6d6]",
  "from-[#8fd3ff] to-[#b8e4ff]",
  "from-[#ffd27a] to-[#ffe8b0]",
  "from-[#8be0b4] to-[#c7f0da]",
];

function colorForName(name: string): string {
  const code = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function ParticipantAvatars({
  participants,
  max = 4,
  className,
}: ParticipantAvatarsProps) {
  const visible = participants.slice(0, max);
  const overflow = participants.length - visible.length;

  if (visible.length === 0) return null;

  const completedCount = participants.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex -space-x-2.5">
        {visible.map((participant) => (
          <span
            key={participant.clientId}
            title={participant.displayName}
            className="relative inline-flex"
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(45,49,66,0.12)]",
                colorForName(participant.displayName),
                participant.isMe && "ring-2 ring-sai-primary ring-offset-1"
              )}
            >
              {participant.displayName.slice(0, 1)}
            </span>
            {participant.status === "completed" && (
              <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-[#34C759]">
                <Check className="size-2.5 text-white" strokeWidth={3.5} />
              </span>
            )}
          </span>
        ))}
        {overflow > 0 && (
          <span className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-sai-bg text-[11px] font-semibold text-sai-text-secondary">
            +{overflow}
          </span>
        )}
      </div>
      <p className="text-[12px] font-medium text-sai-text-secondary">
        {completedCount > 0
          ? `${completedCount}/${participants.length}명 완료`
          : `${participants.length}명 함께하는 중`}
      </p>
    </div>
  );
}
