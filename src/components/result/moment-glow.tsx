export function MomentGlow() {
  return (
    <div className="relative mx-auto flex size-36 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-sai-primary/10 blur-2xl" />
      <div className="absolute inset-4 rounded-full bg-sai-primary/15 blur-xl" />
      <div className="relative flex size-28 items-center justify-center rounded-full border border-sai-primary/10 bg-sai-surface/80 shadow-[0_4px_32px_rgba(133,118,255,0.12)]">
        <span className="text-[13px] font-medium tracking-[0.12em] text-sai-primary">
          SAI MOMENT
        </span>
      </div>
    </div>
  );
}
