type ConversationFlowProps = {
  items: string[];
};

export function ConversationFlow({ items }: ConversationFlowProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-9">
      <h2 className="text-[17px] font-bold tracking-[-0.01em] text-sai-text">
        이런 흐름으로 이어져요
      </h2>
      <p className="mt-1 text-[13px] text-sai-text-secondary">
        가볍게 시작해서 자연스럽게 가까워져요
      </p>

      <ol className="relative mt-5">
        <span
          aria-hidden
          className="absolute bottom-7 left-[17px] top-5 w-[2px] bg-gradient-to-b from-sai-primary/40 to-sai-primary/10"
        />
        {items.map((item, index) => (
          <li
            key={index}
            className="relative flex items-center gap-3.5 pb-3 last:pb-0"
          >
            <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sai-primary to-[#B6A9FF] text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(145,129,244,0.35)]">
              {index + 1}
            </span>
            <div className="flex-1 rounded-[16px] bg-white px-4 py-3.5 shadow-[0_2px_14px_rgba(45,49,66,0.05)]">
              <p className="text-[14.5px] font-medium leading-snug text-sai-text">
                {item}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
