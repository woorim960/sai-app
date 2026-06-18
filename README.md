# 사이 (SAI)

더 가까워지고 싶은 사람과 함께 게임하고 대화하며 자연스럽게 알아갈 수 있도록 돕는 관계형 보드게임 플랫폼 MVP.

## 기술 스택

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- Mock data (`src/lib/data/`) + **Supabase Repository** (`NEXT_PUBLIC_DATA_SOURCE=supabase`)
- 그룹 플레이: in-memory 또는 Supabase (`NEXT_PUBLIC_GROUP_STORE`)

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 화면 구조

| 경로 | 화면 | 설명 |
|------|------|------|
| `/` | Splash | 온보딩 완료 시 `/home`, 미완료 시 `/onboarding` |
| `/onboarding` | 온보딩 | 3장 슬라이드, 마지막 "시작하기" → `/home` |
| `/home` | 홈 | 상황 필터 + 추천/인기 덱 캐러셀 |
| `/games` | 게임 | 카테고리별 덱 탐색 |
| `/together` | 둘이하기 | 이어하기, 궁합, 커플 연결, 기록 |
| `/browse` | 둘러보기 | 상황별 그리드 + 인기 덱 |
| `/archive` | 보관함 | 플레이 기록 + 결과 다시 보기 |
| `/my` | 마이 | 프로필·설정 |
| `/situations/[situationId]` | Deck List | 상황별 덱 목록 |
| `/decks/[deckId]` | Deck Detail | 덱 상세 + **각자하기** / **함께하기** CTA |
| `/group/[groupId]/play` | Async Play | 각자하기 플레이 |
| `/group/[groupId]/result` | Async Result | 2단계 결과 (내 결과 → 2명+ 비교) + 친구 초대 |
| `/invite/[groupId]` | Invite | 초대 링크 입장 |
| `/room/[groupId]` | Sync Lobby | 함께하기 대기실 |
| `/room/[groupId]/play` | Sync Play | 실시간 함께 플레이 |
| `/room/[groupId]/result` | Sync Result | 함께하기 결과 |
| `/play/[deckId]`, `/result/[deckId]` | Redirect | `/decks/[deckId]`로 리다이렉트 (Solo 제거) |

## 데이터 구조 (`src/lib/data/`)

총 **180장** (12 덱 × 15장). 모듈별 분리:

| 파일 | 역할 |
|------|------|
| `types.ts` | Situation, Deck, Card 타입 |
| `situations.ts` | 4가지 상황 |
| `decks.ts` | 12개 덱 (`some-closer`는 Premium 데모) |
| `deck-card-inputs.ts` | 덱별 카드 원본 정의 |
| `card-builders.ts` | `balanceCard`, `questionCard`, `buildCards` |
| `cards.ts` | 전체 카드 배열 생성 |
| `helpers.ts` | 조회/포맷 헬퍼 |
| `index.ts` | 통합 export |

`src/lib/data.ts`는 `./data/index`를 re-export합니다.

### Types

```typescript
Situation  — id, emoji, name, subtitle, description, sortOrder
Deck       — id, situationId, title, description, estimatedMinutes,
             moodLevel, cardCount, isPremium, sortOrder
Card       — id, deckId, phase, type, question, optionA?, optionB?,
             helperText, sortOrder
```

- `Card.phase`: `ice_breaking` | `taste` | `value` | `closing`
- `Card.type`: `balance` | `question`

### Helpers

| 함수 | 설명 |
|------|------|
| `getSituationById(id)` | 상황 조회 |
| `getAllSituations()` | sortOrder 순 상황 목록 |
| `getDecksBySituationId(situationId)` | 상황별 덱 목록 |
| `getDeckById(id)` | 덱 조회 |
| `getCardsByDeckId(deckId)` | 덱별 카드 (sortOrder 순) |
| `getPopularDecks()` | 홈 인기 덱 3종 |
| `getSituationByDeckId(deckId)` | 덱 → 상황 |
| `getConversationPreview(deckId)` | Deck Detail 대화 흐름 |
| `getSituationListMessage(situation)` | Deck List 헤더 문구 |
| `formatEstimatedMinutes(n)` | `"5분"` 포맷 |

## API Layer (`src/lib/api/`)

Supabase 연동 전 Repository 패턴:

```typescript
import { getRepository } from "@/lib/api";

const repo = getRepository();
const decks = await repo.getDecksBySituationId("blind-date");
```

`mockRepository`가 기본값입니다. Supabase 사용 시 `.env`에 아래를 설정하세요:

```bash
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

스키마: `supabase/schema.sql`  
시드: `SUPABASE_SERVICE_ROLE_KEY` 설정 후 `npm run seed:supabase`

Supabase 오류 시 자동으로 mock 데이터로 fallback 합니다.

## 로컬 저장 (`src/lib/storage.ts`)

| 키 | 저장소 | 용도 |
|----|--------|------|
| `sai_onboarding_complete` | localStorage + cookie | 온보딩 완료 (탭·탐색 라우트 guard) |
| `sai_premium_unlocked` | localStorage + cookie | Premium 덱 체험판 잠금 해제 |
| `sai_active_games` | localStorage | 진행 중 그룹 플레이 북마크 (이어하기) |
| `sai_client_id` | localStorage | 익명 참여자 ID (그룹 API 세션) |
| `sai_group_sessions` | localStorage | 그룹별 HMAC 세션 토큰 |
| `sai_completed_decks` | localStorage | 완료한 덱 ID 목록 |

> Solo 플레이 제거로 `sai_play_progress_*`, `sai_play_answers_*`는 더 이상 사용하지 않습니다.

온보딩 완료 시 cookie(`sai_onboarding_complete`)도 함께 설정됩니다.

- **온보딩 필수**: `/home`, `/games`, `/together`, `/browse`, `/archive`, `/my`, `/situations`
- **온보딩 없이 진입 가능** (가벼운 안내 배너): `/decks`, `/invite`, `/group`, `/room` — 초대 링크로 바로 플레이 가능

## UI Theme (`src/lib/ui-theme.ts`)

DB에 포함되지 않는 프레젠테이션 전용 (accent color, gradient).

## 프로젝트 구조

```
src/
├── app/                    # 라우트 + not-found
├── components/
│   ├── layout/             # MobileShell, RouteFallback
│   ├── splash/
│   ├── onboarding/
│   ├── home/
│   ├── situation/
│   ├── deck/               # PremiumBadge, DeckPlayActions
│   ├── group/              # GroupPlay, SyncPlay, Join, Lobby, Result
│   ├── gameplay/
│   └── ui/
└── lib/
    ├── data/               # 콘텐츠 데이터
    ├── api/                # Repository 패턴 (덱/카드)
    ├── group/              # 그룹 Repository, 세션, API 클라이언트
    ├── storage.ts          # localStorage/cookie
    └── constants.ts
public/
├── manifest.json           # PWA manifest
└── icon.svg
e2e/                        # Playwright E2E
scripts/
└── validate-data.mts       # 데이터 무결성 검증
```

## 배포 (Vercel + Supabase)

Production 배포는 **[DEPLOYMENT.md](./DEPLOYMENT.md)** 를 따르세요. Phase A(Supabase) → B(Vercel) → C(검증) 순서이며, 커스텀 도메인(Phase D)은 제외합니다.

요약:

1. **Supabase**: `supabase/schema.sql` 실행 → `npm run seed:supabase` → `npm run verify:supabase`
2. **Vercel**: GitHub 연동 후 [`.env.production.example`](./.env.production.example) 환경변수 등록 → Deploy
3. **검증**: HTTPS Vercel URL에서 모바일 각자하기·초대·함께하기 체크리스트

```bash
npm run verify:supabase   # DB 스키마·시드 검증
npm run generate:secret   # GROUP_SESSION_SECRET 생성
```

## 스크립트

```bash
npm run dev           # 개발 서버
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버
npm run lint          # ESLint
npm run validate:data # 덱/카드 데이터 검증 (180장, sortOrder 1–15)
npm run seed:supabase # Supabase 시드 (service role key 필요)
npm run verify:supabase # Supabase 배포 전 검증 (스키마·시드·anon read)
npm run generate:secret # GROUP_SESSION_SECRET 생성 (Vercel 등록용)
npm run test:e2e      # Playwright E2E (dev 서버 자동 기동)
```

E2E 최초 실행 전 Playwright 브라우저 설치:

```bash
npx playwright install chromium
```

## 카드 확장

`deck-card-inputs.ts`에 카드를 추가하면 `buildCards`로 자동 반영됩니다.

```typescript
"blind-ice-breaking": [
  balanceCard("ice_breaking", 1, "옵션A VS 옵션B", "헬퍼 텍스트"),
  questionCard("taste", 2, "질문 내용", "헬퍼 텍스트"),
  // sortOrder 1~15
],
```

추가 후 `npm run validate:data`로 cardCount·sortOrder·balance 옵션을 확인하세요.

## 플레이 모드

Deck Detail에서 두 가지 모드만 제공합니다 (Solo 제거).

| 모드 | 설명 |
|------|------|
| **각자하기** | 혼자 플레이 → **결과 화면에서** 친구 초대 → 각자 플레이 → 결과 비교 |
| **함께하기** | Lobby에서 링크 공유 → 실시간 같은 카드 진행 → 결과 비교 |

### URL

| URL | 용도 |
|-----|------|
| `/group/[id]/play` | 각자하기 플레이 |
| `/group/[id]/result` | 각자하기 통합 결과 + **친구 초대하기** |
| `/invite/[id]` | 초대 링크 (친구 입장) |
| `/room/[id]` | 함께하기 Lobby |
| `/room/[id]/play` | 함께하기 Sync 플레이 |
| `/room/[id]/result` | 함께하기 결과 |

### 데이터 저장

| 환경변수 | 기본값 | 설명 |
|----------|--------|------|
| `NEXT_PUBLIC_GROUP_STORE` | `memory` | `supabase`로 전환 시 DB 영속 |
| `GROUP_SESSION_SECRET` | dev fallback | 그룹 API HMAC 세션 서명 |
| `GROUP_TTL_DAYS` | `7` | 그룹 데이터 보관 기간 (일) |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Supabase 그룹 쓰기 (필수) |

- **개발**: in-memory store (`src/lib/group/memory-store.ts`)
- **프로덕션**: `NEXT_PUBLIC_GROUP_STORE=supabase` + `supabase/schema.sql`의 `play_groups` 테이블

그룹 API는 HMAC 세션 토큰으로 인증합니다. 생성/참여 시 토큰이 발급되며, 답변·진행·Host 액션에 필요합니다.  
GET `/api/groups/[id]`는 토큰 없이 공개 미리보기만 반환합니다 (답변 제외).  
만료된 그룹은 **410 Gone** / 페이지 fallback으로 안내됩니다.

### 각자하기 결과 (2단계)

1. **대기 단계** (완료 1명): 내 Balance 선택 요약 + 친구 초대 CTA. 비교 섹션은 잠금.
2. **비교 단계** (완료 2명+): Insight + 모두의 선택 비교. 호스트 결과 페이지는 폴링으로 자동 갱신.

### 그룹 결과 Insight

플레이 완료 후 결과 화면에서 개인·그룹 맞춤 Insight 카드를 표시합니다.

| Insight | 조건 |
|---------|------|
| 나의 오늘 선택 | 본인 Balance 선택 기록 |
| 취향 일치/차이 | 2명 이상 완료 시 선택 비교 |
| 가장 갈린 순간 | 의견이 가장 분분했던 Balance 카드 |
| 완벽한 일치 | 모두 같은 선택을 한 카드 |
| 상황별 기본 Insight | `result-data.ts` 상황별 카피 |

### TTL / 만료

- 생성 시 `expiresAt = createdAt + GROUP_TTL_DAYS` (기본 7일)
- 만료 후 조회 시 데이터 삭제 + "만료된 대화" 안내 (같은 덱 **다시 시작하기** CTA)
- Supabase: `scripts/cleanup-expired-groups.sql`로 배치 정리 가능

```bash
NEXT_PUBLIC_GROUP_STORE=supabase
GROUP_SESSION_SECRET=your-random-secret
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```


`decks.ts`에서 `isPremium: true`인 덱은:

- 목록/상세에 Premium 배지 표시
- 상세에서 **체험판 시작하기**로 잠금 해제 (결제 없는 데모)
- 해제 전 Deck Detail에서 **각자하기** / **함께하기** 비활성화
- 초대 링크로 참여한 게스트는 Premium 잠금 없이 플레이 가능

데모: `some-closer` (썸 → 조금 더 가까워지기)

## PWA / SEO

- `public/manifest.json` — standalone PWA
- `public/sw.js` — Service Worker (정적 캐시 + 오프라인 fallback)
- `src/app/opengraph-image.tsx` — 동적 OG PNG (1200×630)
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `layout.tsx` — Open Graph, Twitter Card, apple-web-app 메타
- `NEXT_PUBLIC_SITE_URL` 환경변수로 OG URL 설정 (기본: `https://sai.app`)

## 향후 개선

- Supabase Auth 연동
- Premium 실결제 + 서버 검증
- Service Worker 캐시 전략 고도화
- 궁합 테스트 커플 동기화 (Supabase)
