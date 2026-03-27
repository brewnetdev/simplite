# Quickstart: KMS 프론트엔드 버그 수정 및 UI 재정비

**Branch**: `002-kms-frontend-fix`

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (로컬 설치)
- 백엔드 서버(`apps/api`)가 실행 중이어야 함

## Setup

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 확인
# 루트 .env.local에 DATABASE_URL, JWT 시크릿 등 설정

# 3. DB 마이그레이션 (최초 1회)
cd packages/db && pnpm drizzle-kit push && cd ../..

# 4. 에디터 빌드 (최초 1회)
pnpm --filter @markflow/editor build

# 5. 전체 실행 (API + Web 동시)
pnpm dev
```

## Access

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:3002 | 3002 |
| Backend API | http://localhost:4000/api/v1 | 4000 |
| PostgreSQL | localhost:5432 | 5432 |

## Test

```bash
# Unit tests
pnpm --filter @markflow/web test

# E2E tests (프론트엔드 + 백엔드 실행 중이어야 함)
pnpm --filter @markflow/web test:e2e
```

## Design Reference

프로토타입 HTML: `docs/markflow-prototype.html` (브라우저에서 열어 참조)

핵심 디자인 토큰:
- Background: `#F8F7F4`
- Accent blue: `#1A56DB`
- Text: `#1A1916`
- Header: 56px
- Sidebar: 260px
- Font: DM Sans (body), Sora (headings), JetBrains Mono (code)
