export function HomeHero() {
  return (
    <section className="relative px-5 pt-5">
      <h2 className="max-w-[280px] text-[28px] font-bold leading-[1.32] tracking-[-0.03em] text-sai-text">
        어색한 시간을
        <br />
        <span className="text-sai-primary">즐거운 시간으로</span>
      </h2>

      <svg
        aria-hidden
        className="pointer-events-none absolute right-6 top-8 text-sai-primary/70"
        width="48"
        height="40"
        viewBox="0 0 48 40"
        fill="none"
      >
        <path
          d="M6 28C14 18 22 12 34 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M30 6C32 10 33 14 32 18C31 22 28 24 24 24C20 24 18 21 19 17C20 13 24 9 30 6Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>

      <p className="mt-7 text-[16px] font-bold text-sai-text">
        지금 누구와 함께 있나요?
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-sai-text-secondary">
        덱을 고른 뒤 <span className="font-medium text-sai-text">각자하기</span>
        또는 <span className="font-medium text-sai-text">함께하기</span>를
        선택하세요.
      </p>
    </section>
  );
}
