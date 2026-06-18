import { cn } from "@/lib/utils";

type GameplayBackLinkProps = {
  href: string;
  confirmMessage?: string;
  className?: string;
};

export function GameplayBackLink({
  href,
  confirmMessage,
  className,
}: GameplayBackLinkProps) {
  return (
    <a
      href={href}
      data-sai-back
      data-confirm={confirmMessage}
      aria-label="뒤로가기"
      className={cn(
        "flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/[0.04] active:scale-95 touch-manipulation",
        className
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5 text-sai-text"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </a>
  );
}
