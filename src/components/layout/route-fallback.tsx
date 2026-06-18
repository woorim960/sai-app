import Link from "next/link";
import { MobileShell } from "@/components/layout/mobile-shell";
import { APP_NAME } from "@/lib/constants";

type RouteFallbackProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function RouteFallback({
  title = "페이지를 찾을 수 없어요",
  description = "요청하신 내용을 찾지 못했어요.\n홈에서 다시 시작해보세요.",
  primaryHref = "/home",
  primaryLabel = "홈으로",
  secondaryHref,
  secondaryLabel,
}: RouteFallbackProps) {
  return (
    <MobileShell className="page-enter">
      <div className="flex h-full flex-col items-center justify-center px-6 pb-8 safe-pt safe-pb text-center">
        <p className="text-[22px] font-semibold text-sai-text">{APP_NAME}</p>
        <h1 className="mt-8 text-[22px] font-semibold leading-relaxed text-sai-text">
          {title}
        </h1>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-sai-text-secondary">
          {description}
        </p>
        <div className="mt-10 flex w-full max-w-[320px] flex-col gap-3">
          <Link
            href={primaryHref}
            className="flex h-14 items-center justify-center rounded-[18px] bg-sai-primary text-[16px] font-medium text-white transition-colors hover:bg-sai-primary/90"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="flex h-14 items-center justify-center rounded-[18px] text-[16px] font-medium text-sai-primary transition-colors hover:bg-accent"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
