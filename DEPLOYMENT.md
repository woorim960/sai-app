# SAI 배포 가이드 (Phase A → C)

> 커스텀 도메인(Phase D) 제외.  
> 협업 흐름: **AI가 코드/스크립트 준비 → 당신이 Supabase/Vercel 콘솔 작업 → 결과 전달 → AI가 후속 작업**

---

## 아키텍처 요약

| 계층 | 서비스 | 역할 |
|------|--------|------|
| 앱 + API | **Vercel** | Next.js SSR, `/api/*` 서버리스 |
| DB | **Supabase** | 덱/카드 콘텐츠 + 그룹 플레이 상태 |
| 로컬 | `memory` / `mock` | 개발 전용 (Production 사용 금지) |

**Production에서 `NEXT_PUBLIC_GROUP_STORE=memory` 는 동작하지 않습니다.**  
Vercel은 요청마다 다른 인스턴스를 쓰기 때문에 in-memory 세션이 유지되지 않습니다.

---

## Phase A — Supabase 셋업 (당신이 수행)

### A-1. 프로젝트 생성

1. [supabase.com](https://supabase.com) 로그인
2. **New project**
3. 리전: **Northeast Asia (Seoul)** 권장
4. DB 비밀번호 저장 (분실 시 복구 어려움)

### A-2. 스키마 적용

1. Supabase 대시보드 → **SQL Editor** → New query
2. 이 repo의 [`supabase/schema.sql`](./supabase/schema.sql) 전체 복사·실행
3. 성공 메시지 확인

### A-3. API 키 확인

**Project Settings → API** 에서 복사:

| 키 | 용도 |
|----|------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` (서버 전용) |

### A-4. 로컬에서 시드 + 검증

터미널에서 (키는 채팅에 붙여넣지 말고 로컬에서만 사용):

```bash
cd /Users/woorim/Desktop/development/js/sai-app

# 시드
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
npm run seed:supabase

# 검증 (180 cards 등)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
npm run verify:supabase
```

`✓ Supabase 배포 준비 완료` 가 나오면 A 완료.

### A-5. AI에게 전달할 정보 (비밀 키 제외)

```
Phase A 완료
- Supabase URL: https://xxxx.supabase.co
- verify:supabase: 성공 / 실패
- 시드: 4 situations, 12 decks, 180 cards 확인됨
```

`service_role` 키는 **절대 채팅에 올리지 마세요.** Vercel에만 직접 입력합니다.

---

## Phase B — Vercel 배포 (당신이 수행)

### B-1. 프로젝트 연결

1. [vercel.com](https://vercel.com) 로그인
2. **Add New → Project**
3. GitHub `woorim960/sai-app` Import
4. Framework: **Next.js** (자동)
5. Root Directory: `.` (기본)

### B-2. Environment Variables (Production)

**Settings → Environment Variables** 에 아래를 **Production** 에만 등록.  
템플릿: [`.env.production.example`](./.env.production.example)

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_SITE_URL` | 배포 후 URL (먼저 deploy 후 갱신 가능) |
| `NEXT_PUBLIC_DATA_SOURCE` | `supabase` |
| `NEXT_PUBLIC_GROUP_STORE` | `supabase` |
| `NEXT_PUBLIC_COUPLE_STORE` | `memory` |
| `NEXT_PUBLIC_SUPABASE_URL` | Phase A URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `GROUP_SESSION_SECRET` | `npm run generate:secret` 출력값 |
| `GROUP_TTL_DAYS` | `7` (선택) |

세션 시크릿 생성:

```bash
npm run generate:secret
```

### B-3. Deploy

1. **Deploy** 클릭
2. 빌드 성공 확인 (`validate:data` + `next build`)
3. 배포 URL 예: `https://sai-app-xxx.vercel.app`
4. `NEXT_PUBLIC_SITE_URL` 을 실제 URL로 수정 후 **Redeploy** (OG/리다이렉트 정확도)

### B-4. AI에게 전달할 정보

```
Phase B 완료
- Vercel URL: https://sai-app-xxx.vercel.app
- 빌드: 성공 / 실패 (실패 시 로그 요약)
- NEXT_PUBLIC_SITE_URL 갱신 후 재배포: 완료 / 미완료
```

---

## Phase C — Production 검증 체크리스트 (당신 + AI)

모바일 **시크릿 탭** + **HTTPS Vercel URL** 기준.

### C-1. 기본

- [ ] `/` → 스플래시 → 온보딩 또는 `/home`
- [ ] `/home` 덱·상황 목록 표시 (Supabase 콘텐츠)
- [ ] `/decks/{deckId}` 덱 상세

### C-2. 각자하기 (async) — **최우선**

- [ ] 덱 상세 → **각자하기** → 플레이 화면
- [ ] 밸런스 선택 → **다음 질문** → 다음 카드 (페이지 이동)
- [ ] 마지막 카드 → **결과 보기**
- [ ] 결과 화면에서 **친구 초대** 링크
- [ ] 다른 기기/브라우저에서 초대 링크 입장 → 플레이 → 결과 비교

### C-3. 함께하기 (sync)

- [ ] **함께하기** → Lobby → 링크 공유
- [ ] 2인 입장 → Host 시작 → Sync 플레이 → 결과

### C-4. 회귀

- [ ] 뒤로가기 (플레이 화면)
- [ ] Premium 덱 체험 잠금 해제 (`some-closer`)

### C-5. AI에게 전달

```
Phase C 결과
- 각자하기 다음 질문: OK / FAIL
- 초대 2인 결과: OK / FAIL / 미테스트
- 함께하기: OK / FAIL / 미테스트
- 실패 시: 기기( iOS/Android ), URL, 증상
```

---

## 로컬 vs Production 차이

| 항목 | 로컬 dev | Vercel Production |
|------|----------|-------------------|
| 그룹 저장 | memory | **supabase 필수** |
| 덱 데이터 | mock (기본) | supabase |
| HTTPS | http (LAN 가능) | https 자동 |
| 모바일 플레이 검증 | 부정확할 수 있음 | **기준 환경** |

---

## 유용한 스크립트

```bash
npm run validate:data      # 180장 데이터 무결성
npm run seed:supabase        # Supabase 콘텐츠 시드
npm run verify:supabase      # 배포 전 DB 검증
npm run generate:secret      # GROUP_SESSION_SECRET 생성
npm run build                # Production 빌드 로컬 확인
```

---

## 운영 (배포 후)

- 만료 그룹 정리: [`scripts/cleanup-expired-groups.sql`](./scripts/cleanup-expired-groups.sql) — Supabase SQL Editor에서 주기 실행
- CI: GitHub Actions — push `main` 시 build + e2e

---

## 다음에 AI가 할 일 (당신이 Phase 정보 전달 후)

| Phase | AI 후속 작업 |
|-------|----------------|
| A 완료 | verify 결과 기반 스키마/시드 이슈 수정 |
| B 완료 | 빌드 실패 로그 분석, env 누락 진단, redeploy 가이드 |
| C 실패 | 모바일 플레이 버그 재현·수정, 재배포 |
