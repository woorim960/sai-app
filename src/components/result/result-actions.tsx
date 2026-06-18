import Link from "next/link";

type ResultActionsProps = {
  situationId: string;
};

export function ResultActions({ situationId }: ResultActionsProps) {
  return (
    <footer className="mt-8 space-y-3">
      <Link href={`/situations/${situationId}`} className="sai-btn-dark">
        다른 덱 해보기
      </Link>
      <Link
        href="/home"
        className="flex h-14 w-full items-center justify-center rounded-[18px] bg-sai-surface text-[16px] font-semibold text-sai-primary shadow-[0_2px_12px_rgba(45,49,66,0.05)] transition-colors hover:bg-accent active:scale-[0.98]"
      >
        홈으로
      </Link>
    </footer>
  );
}
