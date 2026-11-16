# marry-jimin

성욱 ♥ 지민 모바일 청첩장 — React + TypeScript + Vite + Supabase, FSD 아키텍처.

## 시작하기

```bash
yarn install
cp .env.example .env   # Supabase 키 입력 (비워두면 localStorage 로 동작)
yarn dev
```

| 명령 | 설명 |
| --- | --- |
| `yarn dev` | 개발 서버 (모바일 기기에서 같은 Wi-Fi 로 접속 가능) |
| `yarn build` | 타입체크 + 프로덕션 빌드 |
| `yarn typecheck` | 타입체크만 |
| `yarn lint` | oxlint |

## Supabase 연동

1. Supabase 프로젝트 생성
2. SQL Editor 에서 `supabase/migrations/20261115000000_init.sql` 실행
   - `guestbook` : 누구나 조회/작성
   - `rsvp` : 누구나 작성, 조회는 대시보드에서만 (select 정책 없음)
3. `.env` 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 입력

## 배포 (GitHub Pages)

`main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 빌드 후
https://kimgtae12.github.io/marry-jimin/ 으로 자동 배포합니다.

Supabase 를 연결하려면 저장소 **Settings → Secrets and variables → Actions** 에
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 를 등록한 뒤 다시 배포하세요.

## 내용 수정

청첩장 문구·계좌·교통편·사진은 모두 `src/entities/wedding/model/wedding.ts` 한 곳에서 관리합니다.
사진은 `public/images/` 에 넣고 `mainPhoto`, `gallery` 에 `publicUrl('images/xxx.jpg')` 형태로 적으면 됩니다.

## 구조 (FSD)

```
src/
├─ app/        진입점, 전역 스타일, Provider
├─ pages/      invitation — 섹션 조립 + 풀페이지 스크롤 컨테이너
├─ widgets/    letter-envelope, hero, greeting, wedding-calendar, gallery,
│              location, guestbook, account, rsvp
├─ features/   write-guestbook, submit-rsvp, copy-account
├─ entities/   wedding(데이터), guestbook, rsvp (타입 + API)
└─ shared/     api(supabase), config, lib, ui
```

## 봉투 효과

`widgets/letter-envelope` — 청첩장 본문 전체가 한 장의 긴 편지지입니다.

- 최상단: 편지가 살짝 작게 봉투 주머니에 꽂혀 있습니다. (메인 폴라로이드가 바로 보임)
- 스크롤: 편지가 화면 폭으로 펼쳐지고 주머니가 아래로 내려가며, 이후 하단에 고정된 주머니 뒤에서 편지가 계속 빠져나옵니다.
- 다시 최상단으로 오면 편지가 주머니에 꽂힌 모습으로 돌아갑니다.

`prefers-reduced-motion` 환경에서는 봉투 없이 일반 페이지(메인 → 본문)로 보여줍니다.
