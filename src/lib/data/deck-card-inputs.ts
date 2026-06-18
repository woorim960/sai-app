import type { CardInput } from "./types";
import { balanceCard, questionCard } from "./card-builders";

const deckCardInputs: Record<string, CardInput[]> = {
  "blind-ice-breaking": [
    balanceCard(
      "ice_breaking",
      1,
      "민초파 VS 반민초파",
      "각자의 선택과 이유를 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "평생 떡볶이만 먹기 VS 평생 치킨만 먹기",
      "왜 그 선택이 더 끌리는지 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "여행은 계획형 VS 즉흥형",
      "각자의 여행 스타일을 편하게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "아침형 인간 VS 야행성 인간",
      "생활 리듬 차이를 재미있게 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "카페에서 수다 VS 산책하면서 대화",
      "더 편한 대화 방식을 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "쉬는 날 가장 자주 하는 건 뭐예요?",
      "서로의 평소 모습을 편하게 이야기해보세요."
    ),
    balanceCard(
      "taste",
      7,
      "사진 많이 찍기 VS 눈으로만 담기",
      "각자의 취향 차이를 재미있게 나눠보세요."
    ),
    questionCard(
      "taste",
      8,
      "요즘 가장 자주 보는 콘텐츠는 뭐예요?",
      "요즘 관심사를 자연스럽게 공유해보세요."
    ),
    balanceCard(
      "taste",
      9,
      "맛집 찾아가기 VS 분위기 좋은 곳 가기",
      "데이트 스타일 차이를 가볍게 이야기해보세요."
    ),
    questionCard(
      "taste",
      10,
      "최근에 가장 맛있게 먹은 음식은?",
      "맛있었던 순간을 함께 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "처음 만난 사람과 친해질 때 가장 중요한 건 뭐라고 생각해요?",
      "각자의 기준을 존중하며 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "상대가 어떤 말을 해주면 편해져요?",
      "편안함을 주는 말을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      13,
      "낯가림이 있는 편이에요, 없는 편이에요?",
      "각자의 성향을 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      14,
      "오늘 오기 전에 가장 걱정했던 건 뭐였어요?",
      "솔직하게, 하지만 부담 없이 나눠보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화하면서 의외였던 점 하나만 말해본다면?",
      "오늘 대화를 마무리하며 서로의 인상을 나눠보세요."
    ),
  ],
  "blind-taste": [
    balanceCard(
      "ice_breaking",
      1,
      "영화관 데이트 VS 집에서 영화 보기",
      "각자의 데이트 취향을 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "바다 여행 VS 산 여행",
      "더 끌리는 여행지와 이유를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "깔끔한 식당 VS 감성 있는 식당",
      "식당 선택 기준을 재미있게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "커피 VS 디저트",
      "카페에서 더 중요한 건 무엇인지 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "조용한 사람 VS 리액션 좋은 사람",
      "각자에게 편한 분위기를 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "가장 좋아하는 계절은 언제예요?",
      "계절 취향으로 서로를 알아가보세요."
    ),
    questionCard(
      "taste",
      7,
      "혼자 있을 때 가장 편한 장소는 어디예요?",
      "평소의 나를 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      8,
      "평소에 돈을 가장 아깝지 않게 쓰는 곳은?",
      "각자의 소비 취향을 나눠보세요."
    ),
    balanceCard(
      "taste",
      9,
      "미리 예약된 데이트 VS 즉석에서 정하는 데이트",
      "데이트 준비 스타일 차이를 이야기해보세요."
    ),
    questionCard(
      "taste",
      10,
      "꼭 한 번 가보고 싶은 장소가 있어요?",
      "함께 상상해볼 수 있는 장소를 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "사람을 볼 때 가장 먼저 보게 되는 매력은?",
      "각자의 시선을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      12,
      "연락은 자주 하는 게 좋아요, 편할 때 하는 게 좋아요?",
      "연락 스타일 차이를 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      13,
      "좋은 하루였다고 느끼는 기준은 뭐예요?",
      "하루를 평가하는 기준을 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "나랑 잘 맞는 사람은 어떤 사람 같아요?",
      "부담 없이 각자의 생각을 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 이야기 중에 다음에 더 얘기해보고 싶은 주제는?",
      "다음 대화를 기대하며 마무리해보세요."
    ),
  ],
  "blind-deep-talk": [
    balanceCard(
      "ice_breaking",
      1,
      "첫인상 중요한 편 VS 대화하면서 바뀌는 편",
      "첫인상에 대한 생각을 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "연락이 편한 사람 VS 만나면 편한 사람",
      "각자에게 편한 관계 방식을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "설레는 연애 VS 편안한 연애",
      "더 끌리는 연애 스타일을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "내가 먼저 표현하기 VS 상대 표현 기다리기",
      "감정 표현 방식 차이를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "취미가 비슷한 사람 VS 성격이 잘 맞는 사람",
      "어떤 부분이 더 중요한지 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "요즘 나를 가장 기분 좋게 만드는 건 뭐예요?",
      "요즘의 기분 좋은 순간을 공유해보세요."
    ),
    questionCard(
      "taste",
      7,
      "친해지면 어떤 모습이 많이 나와요?",
      "친해졌을 때의 모습을 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      8,
      "스트레스 받을 때 어떻게 푸는 편이에요?",
      "각자의 힐링 방법을 나눠보세요."
    ),
    questionCard(
      "taste",
      9,
      "사람들이 잘 모르는 내 의외의 모습은?",
      "의외의 면을 재미있게 공유해보세요."
    ),
    questionCard(
      "taste",
      10,
      "누군가와 가까워졌다고 느끼는 순간은 언제예요?",
      "가까워짐을 느끼는 기준을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "연애에서 가장 중요하다고 생각하는 건 뭐예요?",
      "정답은 없어요. 각자의 생각을 존중해주세요."
    ),
    questionCard(
      "value",
      12,
      "편한 관계와 설레는 관계 중 뭐가 더 끌려요?",
      "각자에게 더 맞는 관계를 이야기해보세요."
    ),
    questionCard(
      "value",
      13,
      "좋아하는 사람에게 가장 듣고 싶은 말은?",
      "마음을 전하는 방식에 대해 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "앞으로 어떤 사람이 되고 싶어요?",
      "조심스럽게, 하지만 진심을 담아 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화 후에 상대에게 궁금해진 게 있다면?",
      "오늘 대화를 마무리하며 호기심을 나눠보세요."
    ),
  ],
  "some-flutter": [
    balanceCard(
      "ice_breaking",
      1,
      "매일 짧게 연락하기 VS 가끔 길게 통화하기",
      "각자의 연락 스타일을 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "굿모닝 연락 VS 잘 자 연락",
      "어떤 연락이 더 설레는지 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "먼저 고백하기 VS 고백 받기",
      "각자에게 편한 방식을 재미있게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "카페 데이트 VS 드라이브 데이트",
      "더 끌리는 데이트와 이유를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "애정표현 많이 하기 VS 은근하게 표현하기",
      "애정 표현 스타일 차이를 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "가장 이상적인 데이트는 어떤 모습이에요?",
      "함께 그려보듯 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      7,
      "요즘 가장 설레는 순간은 언제예요?",
      "설레는 순간을 솔직하게 공유해보세요."
    ),
    balanceCard(
      "taste",
      8,
      "연락 자주 하기 VS 만나서 집중하기",
      "썸을 키우는 방식 차이를 이야기해보세요."
    ),
    questionCard(
      "taste",
      9,
      "상대가 해주면 기분 좋아지는 행동은?",
      "작은 것도 좋아요. 구체적으로 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "평소 플러팅을 잘하는 편인가요?",
      "각자의 스타일을 부담 없이 이야기해보세요."
    ),
    questionCard(
      "value",
      11,
      "누군가에게 호감을 느끼는 순간은 언제예요?",
      "호감의 시작을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      12,
      "좋아하는 사람이 생기면 티를 내는 편인가요?",
      "각자의 성향을 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      13,
      "설레는 관계와 편한 관계 중 더 중요한 건?",
      "정답은 없어요. 각자의 생각을 존중해주세요."
    ),
    questionCard(
      "value",
      14,
      "상대가 해준 가장 기억에 남는 말은?",
      "마음에 남은 한마디를 떠올려보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화 중 가장 공감됐던 답변은?",
      "오늘 대화를 마무리하며 서로의 공감을 나눠보세요."
    ),
  ],
  "some-love-values": [
    balanceCard(
      "ice_breaking",
      1,
      "계획적인 연애 VS 자유로운 연애",
      "각자의 연애 스타일을 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "매일 연락 VS 필요한 만큼 연락",
      "연락 빈도에 대한 생각을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "기념일 챙기기 VS 평소 잘하기",
      "어떤 방식이 더 마음에 드는지 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "사랑은 표현해야 한다 VS 알아주길 바란다",
      "애정 표현에 대한 가치관을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "갈등은 바로 해결 VS 시간 두고 해결",
      "각자의 소통 방식을 존중하며 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "연애에서 가장 중요하게 생각하는 건?",
      "각자의 기준을 비교하지 말고 들어보세요."
    ),
    questionCard(
      "taste",
      7,
      "사랑받는다고 느끼는 순간은 언제예요?",
      "사랑받는 순간을 솔직하게 공유해보세요."
    ),
    questionCard(
      "taste",
      8,
      "혼자만의 시간이 필요한 편인가요?",
      "각자의 리듬을 이해하는 시간이에요."
    ),
    questionCard(
      "taste",
      9,
      "상대에게 가장 바라는 점은?",
      "기대를 부담 없이 이야기해보세요."
    ),
    questionCard(
      "taste",
      10,
      "어떤 데이트가 가장 기억에 남을 것 같아요?",
      "함께 상상해볼 수 있는 데이트를 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "연애할 때 가장 행복한 순간은?",
      "행복했던 순간을 따뜻하게 나눠보세요."
    ),
    questionCard(
      "value",
      12,
      "다툼이 생기면 어떻게 해결하는 편이에요?",
      "갈등 해결 방식을 솔직하게 이야기해보세요."
    ),
    questionCard(
      "value",
      13,
      "장기 연애의 비결은 뭐라고 생각해요?",
      "각자의 경험과 생각을 존중하며 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "내가 생각하는 좋은 연애란?",
      "조심스럽게, 하지만 진심을 담아 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 새롭게 알게 된 연애 가치관은?",
      "오늘 대화를 마무리하며 새로운 발견을 나눠보세요."
    ),
  ],
  "some-closer": [
    balanceCard(
      "ice_breaking",
      1,
      "문자보다 전화 VS 전화보다 직접 만나기",
      "각자에게 편한 소통 방식을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "적극적으로 표현 VS 천천히 표현",
      "감정 표현 속도 차이를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "연애는 친구 같은 관계 VS 설레는 관계",
      "더 끌리는 관계 스타일을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "즉흥 여행 VS 계획 여행",
      "함께하는 여행 스타일을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "같이 취미 만들기 VS 각자 취미 존중",
      "관계에서 취미를 대하는 방식을 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "가장 편안함을 느끼는 순간은?",
      "편안함을 느끼는 순간을 공유해보세요."
    ),
    questionCard(
      "taste",
      7,
      "요즘 가장 기대되는 일이 있나요?",
      "기대하는 일을 가볍게 나눠보세요."
    ),
    questionCard(
      "taste",
      8,
      "스스로 생각하는 나의 매력 포인트는?",
      "부담 없이 각자의 매력을 이야기해보세요."
    ),
    questionCard(
      "taste",
      9,
      "가장 해보고 싶은 버킷리스트는?",
      "함께 상상해볼 수 있는 목표를 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "누군가와 가까워졌다고 느끼는 기준은?",
      "가까워짐을 느끼는 기준을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "좋아하는 사람에게 가장 해주고 싶은 것은?",
      "마음을 전하는 방식에 대해 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "가장 기억에 남는 칭찬은?",
      "따뜻했던 칭찬을 떠올려보세요."
    ),
    questionCard(
      "value",
      13,
      "내가 중요하게 생각하는 인간관계 가치관은?",
      "관계에 대한 가치관을 존중하며 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "앞으로 꼭 이루고 싶은 목표는?",
      "조심스럽게, 하지만 진심을 담아 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 상대에게 더 궁금해진 점은?",
      "오늘 대화를 마무리하며 호기심을 나눠보세요."
    ),
  ],
  "early-know-each-other": [
    balanceCard(
      "ice_breaking",
      1,
      "집데이트 VS 밖데이트",
      "각자에게 편한 데이트 스타일을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "계획형 데이트 VS 즉흥 데이트",
      "데이트 준비 방식 차이를 가볍게 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "연락 자주 하기 VS 각자 시간 존중",
      "연애 중 시간을 대하는 방식을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "같이 취미 만들기 VS 각자 취미 즐기기",
      "취미를 함께할지 각자할지 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "주말 하루종일 함께 VS 각자 시간 갖기",
      "주말을 보내는 방식 차이를 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "내가 가장 편안함을 느끼는 데이트는?",
      "편안함을 느끼는 데이트를 공유해보세요."
    ),
    questionCard(
      "taste",
      7,
      "스트레스 받을 때 어떤 위로가 좋아요?",
      "각자에게 필요한 위로 방식을 이야기해보세요."
    ),
    questionCard(
      "taste",
      8,
      "혼자만의 시간이 필요한 편이에요?",
      "각자의 리듬을 이해하는 시간이에요."
    ),
    questionCard(
      "taste",
      9,
      "가장 좋아하는 휴식 방법은?",
      "평소 쉬는 방식을 편하게 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "연애하면서 꼭 해보고 싶은 버킷리스트는?",
      "함께 상상해볼 수 있는 목표를 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "내가 연애할 때 중요하게 생각하는 건?",
      "각자의 기준을 존중하며 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "연인에게 가장 고마움을 느끼는 순간은?",
      "고마웠던 순간을 따뜻하게 나눠보세요."
    ),
    questionCard(
      "value",
      13,
      "내가 생각하는 이상적인 연애는?",
      "조심스럽게, 하지만 진심을 담아 이야기해보세요."
    ),
    questionCard(
      "value",
      14,
      "연인이 된 뒤 가장 달라진 점은?",
      "함께하면서 달라진 모습을 따뜻하게 나눠보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 새롭게 알게 된 점은?",
      "오늘 대화를 마무리하며 새로운 발견을 나눠보세요."
    ),
  ],
  "early-love-language": [
    balanceCard(
      "ice_breaking",
      1,
      "말로 표현 VS 행동으로 표현",
      "각자의 애정 표현 방식을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "매일 사랑한다고 말하기 VS 특별한 순간에만 말하기",
      "사랑을 말하는 빈도에 대한 생각을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "서프라이즈 이벤트 VS 소소한 배려",
      "어떤 표현이 더 마음에 드는지 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "스킨십 중요 VS 대화 중요",
      "관계에서 중요하게 생각하는 연결 방식을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "편지 VS 선물",
      "더 감동받는 애정 표현을 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "가장 감동받았던 애정 표현은?",
      "마음에 남았던 표현을 떠올려보세요."
    ),
    questionCard(
      "taste",
      7,
      "사랑받는다고 느끼는 순간은?",
      "사랑받는 순간을 솔직하게 공유해보세요."
    ),
    questionCard(
      "taste",
      8,
      "내가 자주 하는 애정 표현은?",
      "평소 표현하는 방식을 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      9,
      "연인에게 가장 듣고 싶은 말은?",
      "마음을 전하는 말을 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "상대가 해주면 가장 기분 좋은 행동은?",
      "작은 것도 좋아요. 구체적으로 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "표현이 부족한 사람에 대해 어떻게 생각해?",
      "각자의 관점을 존중하며 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "기념일을 중요하게 생각해?",
      "기념일에 대한 생각 차이를 나눠보세요."
    ),
    questionCard(
      "value",
      13,
      "사랑은 노력이라고 생각해?",
      "사랑에 대한 생각을 솔직하게 이야기해보세요."
    ),
    questionCard(
      "value",
      14,
      "연애에서 표현이 얼마나 중요하다고 생각해?",
      "표현의 중요성에 대해 나눠보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 상대에게 해주고 싶은 말은?",
      "오늘 대화를 마무리하며 마음을 전해보세요."
    ),
  ],
  "early-future": [
    balanceCard(
      "ice_breaking",
      1,
      "여행 자주 가기 VS 집에서 쉬기",
      "여가를 보내는 방식 차이를 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "돈 쓰는 경험 VS 저축 우선",
      "소비와 저축에 대한 생각을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "도시 생활 VS 자연 속 생활",
      "더 끌리는 삶의 환경을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "계획적인 삶 VS 유연한 삶",
      "삶을 대하는 태도 차이를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "커리어 우선 VS 워라밸 우선",
      "각자의 우선순위를 존중하며 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "앞으로 꼭 해보고 싶은 것은?",
      "하고 싶은 일을 가볍게 상상해보세요."
    ),
    questionCard(
      "taste",
      7,
      "인생 버킷리스트 1순위는?",
      "꼭 이루고 싶은 목표를 나눠보세요."
    ),
    questionCard(
      "taste",
      8,
      "가장 이루고 싶은 목표는?",
      "각자의 목표를 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      9,
      "10년 후 어떤 모습일 것 같아?",
      "부담 없이 미래를 상상해보세요."
    ),
    questionCard(
      "taste",
      10,
      "미래에 가장 기대되는 것은?",
      "기대하는 미래를 솔직하게 공유해보세요."
    ),
    questionCard(
      "value",
      11,
      "행복한 삶의 기준은 뭐라고 생각해?",
      "각자의 기준을 존중하며 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "가장 중요하게 생각하는 가치관은?",
      "가치관 차이를 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      13,
      "인생에서 꼭 지키고 싶은 것은?",
      "조심스럽게, 하지만 진심을 담아 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "함께 이루고 싶은 꿈이 있다면?",
      "함께 그릴 수 있는 꿈을 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화를 통해 더 기대되는 미래는?",
      "오늘 대화를 마무리하며 미래에 대한 기대를 나눠보세요."
    ),
  ],
  "friend-laugh": [
    balanceCard(
      "ice_breaking",
      1,
      "평생 라면만 먹기 VS 평생 김밥만 먹기",
      "각자의 선택과 이유를 가볍게 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "웃긴 사람 되기 VS 설레는 사람 되기",
      "더 끌리는 캐릭터를 재미있게 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "드립 잘 치는 사람 VS 리액션 좋은 사람",
      "각자에게 편한 유머 스타일을 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "첫인상 좋은 사람 VS 알수록 매력 있는 사람",
      "어떤 매력이 더 끌리는지 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "갑자기 유명해지기 VS 조용히 부자로 살기",
      "가볍게 상상하며 웃으며 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "처음 친해질 때 어떤 사람에게 끌리는 편이에요?",
      "친해지는 방식에 대해 편하게 이야기해보세요."
    ),
    questionCard(
      "taste",
      7,
      "요즘 제일 자주 웃는 포인트는 뭐예요?",
      "웃게 되는 순간을 함께 나눠보세요."
    ),
    questionCard(
      "taste",
      8,
      "사람들이 말하는 내 첫인상은 어떤 편이에요?",
      "주변에서 듣는 나의 모습을 이야기해보세요."
    ),
    balanceCard(
      "taste",
      9,
      "편한 사람 VS 설레는 사람",
      "각자에게 더 끌리는 관계를 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "누군가에게 호감이 생기는 순간은 언제예요?",
      "호감의 시작을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      11,
      "친해지고 싶을 때 먼저 다가가는 편이에요, 기다리는 편이에요?",
      "각자의 성향을 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      12,
      "친구에서 연인이 될 수 있다고 생각해?",
      "정답은 없어요. 각자의 생각을 존중해주세요."
    ),
    questionCard(
      "value",
      13,
      "사람을 볼 때 오래 기억에 남는 매력은 뭐예요?",
      "기억에 남는 매력을 솔직하게 나눠보세요."
    ),
    questionCard(
      "value",
      14,
      "친한 사람에게만 보여주는 내 모습은?",
      "친한 사이에서의 모습을 편하게 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화하면서 상대에게 새롭게 느낀 매력은?",
      "오늘 대화를 마무리하며 새로 발견한 매력을 나눠보세요."
    ),
  ],
  "friend-taste": [
    balanceCard(
      "ice_breaking",
      1,
      "포차에서 수다 VS 와인바에서 대화",
      "술자리에서 더 편한 분위기를 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "즉흥 약속 VS 미리 잡은 약속",
      "약속 스타일 차이를 가볍게 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "노래방 VS 보드게임",
      "함께할 때 더 재미있는 활동을 골라보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "집에서 쉬기 VS 밖에서 놀기",
      "휴일을 보내는 방식을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "사진 많이 남기기 VS 눈으로만 담기",
      "각자의 취향 차이를 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "가장 좋아하는 휴일 보내는 방식은?",
      "평소 쉬는 방식을 편하게 공유해보세요."
    ),
    questionCard(
      "taste",
      7,
      "같이 있으면 편한 사람의 특징은?",
      "편안함을 느끼는 기준을 이야기해보세요."
    ),
    questionCard(
      "taste",
      8,
      "꼭 한 번 해보고 싶은 데이트 같은 활동은?",
      "함께 상상해볼 수 있는 활동을 나눠보세요."
    ),
    balanceCard(
      "taste",
      9,
      "연락 자주 하는 친구 VS 가끔 봐도 편한 친구",
      "친구 관계에서 편한 연락 스타일을 나눠보세요."
    ),
    questionCard(
      "taste",
      10,
      "기분 안 좋을 때 친구에게 바라는 반응은?",
      "각자에게 필요한 위로 방식을 이야기해보세요."
    ),
    questionCard(
      "value",
      11,
      "좋은 관계에서 가장 중요하다고 생각하는 건?",
      "각자의 기준을 존중하며 나눠보세요."
    ),
    questionCard(
      "value",
      12,
      "연락 스타일이 잘 맞는 게 중요하다고 생각해?",
      "연락에 대한 생각 차이를 이야기해보세요."
    ),
    questionCard(
      "value",
      13,
      "나랑 잘 맞는 사람은 어떤 사람 같아?",
      "부담 없이 각자의 생각을 이야기해보세요."
    ),
    questionCard(
      "value",
      14,
      "오래 가는 관계의 비결은 뭐라고 생각해?",
      "관계에 대한 생각을 솔직하게 나눠보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 이야기 중 다음에 더 해보고 싶은 건?",
      "다음 대화를 기대하며 마무리해보세요."
    ),
  ],
  "friend-closer": [
    balanceCard(
      "ice_breaking",
      1,
      "오래된 친구 VS 새롭게 잘 맞는 사람",
      "각자에게 더 끌리는 관계를 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      2,
      "고민 잘 들어주는 사람 VS 웃게 해주는 사람",
      "더 필요한 사람의 유형을 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      3,
      "성격 비슷한 사람 VS 완전 다른 사람",
      "어떤 조합이 더 끌리는지 나눠보세요."
    ),
    balanceCard(
      "ice_breaking",
      4,
      "편안한 관계 VS 설레는 관계",
      "더 중요하게 생각하는 관계를 이야기해보세요."
    ),
    balanceCard(
      "ice_breaking",
      5,
      "매일 연락하는 사이 VS 가끔 봐도 가까운 사이",
      "편한 관계의 연락 스타일을 나눠보세요."
    ),
    questionCard(
      "taste",
      6,
      "누군가와 가까워졌다고 느끼는 순간은?",
      "가까워짐을 느끼는 기준을 솔직하게 나눠보세요."
    ),
    questionCard(
      "taste",
      7,
      "친한 사람에게만 하는 행동이 있어?",
      "친한 사이에서만 보이는 모습을 이야기해보세요."
    ),
    questionCard(
      "taste",
      8,
      "좋아하는 사람에게 가장 해주고 싶은 건?",
      "마음을 전하는 방식에 대해 나눠보세요."
    ),
    questionCard(
      "taste",
      9,
      "상대가 해주면 오래 기억에 남는 말은?",
      "마음에 남은 한마디를 떠올려보세요."
    ),
    questionCard(
      "taste",
      10,
      "내가 생각하는 내 매력 포인트는?",
      "부담 없이 각자의 매력을 이야기해보세요."
    ),
    questionCard(
      "value",
      11,
      "친구 같은 연애를 어떻게 생각해?",
      "각자의 생각을 존중하며 이야기해보세요."
    ),
    questionCard(
      "value",
      12,
      "좋아하는 마음은 천천히 생기는 편이에요, 갑자기 생기는 편이에요?",
      "각자의 성향을 이해하는 시간이에요."
    ),
    questionCard(
      "value",
      13,
      "연애에서 가장 중요하다고 생각하는 건?",
      "정답은 없어요. 각자의 생각을 존중해주세요."
    ),
    questionCard(
      "value",
      14,
      "앞으로 어떤 사람과 더 가까워지고 싶어요?",
      "조심스럽게, 하지만 진심을 담아 이야기해보세요."
    ),
    questionCard(
      "closing",
      15,
      "오늘 대화하면서 새롭게 느낀 점은?",
      "오늘 대화를 마무리하며 새로운 발견을 나눠보세요."
    ),
  ],
};

export { deckCardInputs };
