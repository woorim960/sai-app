type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`진행률 ${current}/${total}`}
      className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEEDF4]"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-sai-primary via-[#9B8CFF] to-[#B8AEFF] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(133,118,255,0.35)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
