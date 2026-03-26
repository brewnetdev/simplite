# MarkFlow Editor

모노레포 구조의 독립형 Markdown 에디터 프로젝트.

## 구조

```
markflow-editor/
├── packages/
│   └── editor/          @markflow/editor — 독립 에디터 컴포넌트
└── apps/
    └── demo/            Next.js 데모 애플리케이션
```

## 개발 환경 설정

```bash
# pnpm 필요 (없으면: npm install -g pnpm)
pnpm install

# 에디터 패키지 빌드
pnpm --filter @markflow/editor build

# 데모 앱 실행
pnpm --filter @markflow/demo dev
```

## 패키지

### @markflow/editor

독립형 React Markdown 에디터 컴포넌트. 자세한 내용은 [packages/editor/README.md](./packages/editor/README.md) 참고.

**주요 기술:**
- CodeMirror 6 (소스 편집기)
- remark + rehype (마크다운 파싱/렌더링)
- KaTeX (수식)
- Lucide React (아이콘)
- CSS Modules + CSS Variables (스타일링)

### @markflow/demo

에디터 컴포넌트를 시연하는 Next.js 앱.

## 문서

설계 문서는 [`docs/`](./docs/) 디렉토리 참고:

| 문서 | 설명 |
|------|------|
| [00-overview](./docs/00-overview.md) | 시스템 개요 |
| [01-feature-definition](./docs/01-feature-definition.md) | 기능 정의 |
| [05-component-spec](./docs/05-component-spec.md) | 컴포넌트 설계 |
| [07-roadmap](./docs/07-roadmap.md) | 개발 로드맵 |
