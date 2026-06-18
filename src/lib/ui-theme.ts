/** UI 전용 — Supabase 이전 시 프론트엔드 테마 레이어로 유지 */

export const situationAccents: Record<string, string> = {
  "blind-date": "#E8F5E9",
  some: "#F3EFFF",
  "early-love": "#FFF0F0",
  friend: "#FFF8E7",
};

export const situationIconBg: Record<string, string> = {
  "blind-date": "#D4EDDA",
  some: "#E8DEFF",
  "early-love": "#FFE0E0",
  friend: "#FFF0C2",
};

export const situationGradients: Record<string, string> = {
  "blind-date": "from-[#E8E4FF] to-[#F5F3FF]",
  some: "from-[#FFE4EC] to-[#FFF0F5]",
  "early-love": "from-[#FFE8E8] to-[#FFF5F5]",
  friend: "from-[#FFF8E0] to-[#FFFBF0]",
};

export const situationHeroGradients: Record<string, string> = {
  "blind-date": "from-[#E3DEFB] via-[#BEB0F4] to-[#9176E8]",
  some: "from-[#FFE2EC] via-[#FAB3CF] to-[#EE7FA8]",
  "early-love": "from-[#FFE7E5] via-[#F7B6B0] to-[#EC8A84]",
  friend: "from-[#FFF1D6] via-[#F4D293] to-[#E3B257]",
};

export function getSituationAccent(situationId: string): string {
  return situationAccents[situationId] ?? "#F5F3F0";
}

export function getSituationIconBg(situationId: string): string {
  return situationIconBg[situationId] ?? "#F0EDFF";
}

export function getSituationGradient(situationId: string): string {
  return situationGradients[situationId] ?? "from-[#F5F3F0] to-[#FAFAF8]";
}

export function getSituationHeroGradient(situationId: string): string {
  return (
    situationHeroGradients[situationId] ??
    "from-[#E3DEFB] via-[#BEB0F4] to-[#9176E8]"
  );
}
