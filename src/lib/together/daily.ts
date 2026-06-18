export type DailyQuestion = {
  id: string;
  text: string;
};

export const DAILY_QUESTIONS: DailyQuestion[] = [
  { id: "d01", text: "오늘 가장 고마웠던 순간은?" },
  { id: "d02", text: "상대의 어떤 점이 요즘 제일 사랑스러워?" },
  { id: "d03", text: "지금 가장 가고 싶은 여행지는 어디야?" },
  { id: "d04", text: "최근에 나를 가장 웃게 한 일은?" },
  { id: "d05", text: "10년 뒤 우리는 어떤 모습일 것 같아?" },
  { id: "d06", text: "오늘 하루 점수를 매긴다면 몇 점?" },
  { id: "d07", text: "다시 태어나도 지금처럼 만나고 싶어?" },
  { id: "d08", text: "요즘 가장 듣고 싶은 말은?" },
  { id: "d09", text: "우리 첫 만남에서 기억나는 장면은?" },
  { id: "d10", text: "함께 꼭 해보고 싶은 버킷리스트 하나는?" },
  { id: "d11", text: "상대에게 한 가지 선물할 수 있다면?" },
  { id: "d12", text: "오늘 가장 힘들었던 일은 뭐였어?" },
  { id: "d13", text: "내가 더 잘해주고 싶은 부분이 있다면?" },
  { id: "d14", text: "우리만의 특별한 추억 하나를 꼽는다면?" },
  { id: "d15", text: "지금 옆에 있다면 가장 하고 싶은 건?" },
  { id: "d16", text: "최근 상대에게 반했던 순간은?" },
  { id: "d17", text: "주말에 같이 하고 싶은 건?" },
  { id: "d18", text: "내가 모르는 너의 비밀이 있다면?" },
  { id: "d19", text: "요즘 가장 고민되는 일은?" },
  { id: "d20", text: "오늘 서로에게 칭찬 한마디!" },
  { id: "d21", text: "우리 관계에서 가장 소중한 가치는?" },
];

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashDateKey(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDailyQuestion(dateKey = getTodayKey()): DailyQuestion {
  const index = hashDateKey(dateKey) % DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[index]!;
}

export function dailyDeckId(dateKey = getTodayKey()): string {
  return `daily-${dateKey}`;
}
