# @markflow/editor — Standalone

다른 프로젝트에 복사해서 바로 사용할 수 있는 독립형 마크다운 에디터입니다.

## 설치 방법

### 1. 이 폴더를 프로젝트에 복사

```bash
cp -r standalone/ your-project/src/markflow-editor/
```

### 2. 의존성 설치

프로젝트 루트에서 한 줄로 설치:

```bash
npm install ./src/markflow-editor
```

package.json에 정의된 모든 의존성이 자동으로 설치됩니다.

### 3. 사용 예제

```tsx
import { useState } from 'react'
import { MarkdownEditor } from './markflow-editor'
import './markflow-editor/index.css'

function App() {
  const [value, setValue] = useState<string | undefined>(undefined)

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      height="calc(100vh - 100px)"
      layout="split"
      theme="light"
      placeholder="마크다운을 입력하세요…"
    />
  )
}

export default App
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | 제어 모드 콘텐츠 |
| `defaultValue` | `string` | 웰컴 텍스트 | 비제어 모드 초기값 |
| `onChange` | `(value: string) => void` | - | 콘텐츠 변경 콜백 |
| `layout` | `'split' \| 'editor' \| 'preview'` | `'split'` | 레이아웃 |
| `theme` | `'light' \| 'dark'` | `'light'` | 테마 |
| `height` | `string` | `'600px'` | CSS 높이 |
| `placeholder` | `string` | - | 플레이스홀더 |
| `readOnly` | `boolean` | `false` | 읽기 전용 |
| `className` | `string` | - | 루트 커스텀 클래스 |
| `themeVars` | `Record<string, string>` | - | CSS 변수 오버라이드 |

## 테마 커스터마이징

CSS 변수를 오버라이드하여 테마를 변경할 수 있습니다:

```css
.my-custom-editor {
  --mf-accent: #10b981;
  --mf-bg-primary: #fefce8;
  --mf-border-radius: 12px;
}
```

```tsx
<MarkdownEditor className="my-custom-editor" />
```

또는 `themeVars` prop 사용:

```tsx
<MarkdownEditor
  themeVars={{
    '--mf-accent': '#10b981',
    '--mf-bg-primary': '#fefce8',
  }}
/>
```

## 포함된 파일

| 파일 | 설명 |
|------|------|
| `index.js` | 에디터 컴포넌트 (ESM) |
| `index.css` | 모든 스타일 (CSS Variables, 툴바, 에디터, 프리뷰) |
| `index.d.ts` | TypeScript 타입 선언 |
| `package.json` | 의존성 목록 |

## 기능

- CommonMark 0.28 + GFM (테이블, 태스크 리스트, 취소선)
- 코드 구문 하이라이팅 (highlight.js)
- KaTeX 수식 렌더링
- Lucide SVG 아이콘 툴바
- 라이트/다크 테마
- 에디터 ↔ 프리뷰 스크롤 동기화
- 레이아웃 전환 (에디터/분할/프리뷰)
