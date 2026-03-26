# @markflow/editor

독립형 Markdown 에디터 React 컴포넌트. CodeMirror 6 기반 소스 편집기 + remark/rehype 라이브 프리뷰.

## 설치

```bash
pnpm add @markflow/editor
```

> **Peer Dependencies:** `react ^18 || ^19`, `react-dom ^18 || ^19`

## 사용법

```tsx
import { MarkdownEditor } from '@markflow/editor'
import '@markflow/editor/styles'

function App() {
  const [value, setValue] = useState('')

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      height="600px"
      layout="split"
      theme="light"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | 제어 모드 마크다운 콘텐츠 |
| `defaultValue` | `string` | 웰컴 텍스트 | 비제어 모드 초기값 |
| `onChange` | `(value: string) => void` | - | 콘텐츠 변경 콜백 |
| `layout` | `'split' \| 'editor' \| 'preview'` | `'split'` | 레이아웃 모드 |
| `theme` | `'light' \| 'dark'` | `'light'` | 컬러 테마 |
| `height` | `string` | `'600px'` | CSS 높이 값 |
| `placeholder` | `string` | `'Start writing Markdown…'` | 빈 에디터 플레이스홀더 |
| `readOnly` | `boolean` | `false` | 읽기 전용 모드 |
| `className` | `string` | `''` | 루트 요소 커스텀 클래스 |
| `themeVars` | `Record<string, string>` | - | CSS 변수 오버라이드 |

## 테마 커스터마이징

CSS 변수를 오버라이드하여 테마를 커스터마이즈할 수 있습니다:

```css
.my-editor {
  --mf-accent: #10b981;
  --mf-bg-primary: #fefce8;
  --mf-border-radius: 12px;
  --mf-color-heading: #065f46;
}
```

또는 `themeVars` prop을 사용:

```tsx
<MarkdownEditor
  themeVars={{
    '--mf-accent': '#10b981',
    '--mf-bg-primary': '#fefce8',
  }}
/>
```

주요 CSS 변수: `--mf-bg-primary`, `--mf-bg-secondary`, `--mf-text-primary`, `--mf-accent`, `--mf-border-color`, `--mf-border-radius`, `--mf-font-body`, `--mf-font-mono` 등. 전체 목록은 `src/styles/variables.css` 참고.

## 기능

- CommonMark 0.28 + GFM (테이블, 태스크 리스트, 취소선)
- 코드 구문 하이라이팅 (highlight.js)
- KaTeX 수식 렌더링 ($...$, $$...$$)
- 20+ 포매팅 툴바 (Lucide 아이콘)
- 에디터 ↔ 프리뷰 스크롤 동기화
- 라이트/다크 테마
- 레이아웃 전환 (에디터/분할/프리뷰)
- 읽기 전용 모드

## 고급 사용법

```tsx
import { parseMarkdown, applyToolbarAction } from '@markflow/editor'

// 마크다운 → HTML 변환만 사용
const html = parseMarkdown('# Hello **world**')
```
