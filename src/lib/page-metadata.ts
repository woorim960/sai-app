import type { Metadata } from "next";
import type { Deck, Situation } from "@/lib/data";

const defaultDescription =
  "더 가까워지고 싶은 사람과 함께 게임하고 대화하며 자연스럽게 알아가세요.";

export function buildDeckMetadata(deck: Deck): Metadata {
  return {
    title: deck.title,
    description: deck.description,
    openGraph: {
      title: `${deck.title} | 사이`,
      description: deck.description,
    },
  };
}

export function buildSituationMetadata(situation: Situation): Metadata {
  return {
    title: situation.name,
    description: situation.description,
    openGraph: {
      title: `${situation.name} | 사이`,
      description: situation.description,
    },
  };
}

export function buildPlayMetadata(deck: Deck): Metadata {
  return {
    title: `${deck.title} 플레이`,
    description: defaultDescription,
  };
}

export function buildResultMetadata(deck: Deck): Metadata {
  return {
    title: `${deck.title} 결과`,
    description: "오늘 나눈 대화를 돌아보세요.",
  };
}

export function buildGroupInviteMetadata(deck: Deck): Metadata {
  return {
    title: `${deck.title} 초대`,
    description: `${deck.title} 대화에 초대받았어요. 함께 플레이해보세요.`,
    openGraph: {
      title: `${deck.title} 초대 | 사이`,
      description: `${deck.title} 대화에 초대받았어요.`,
    },
  };
}

export function buildGroupResultMetadata(deck: Deck): Metadata {
  return {
    title: `${deck.title} 함께한 결과`,
    description: "함께한 선택을 비교해보세요.",
    openGraph: {
      title: `${deck.title} 결과 | 사이`,
      description: "함께한 선택을 비교해보세요.",
    },
  };
}
