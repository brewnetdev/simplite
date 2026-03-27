#!/bin/bash
# 에디터 툴바 액션 테스트 실행기
# 사용법:
#   ./scripts/item-test.sh all           # 전체 28개 테스트
#   ./scripts/item-test.sh bold          # Bold 테스트만
#   ./scripts/item-test.sh h1            # Heading 1 테스트만
#   ./scripts/item-test.sh list          # 전체 리스트 (ul, ol, task)

set -e
cd "$(dirname "$0")/../packages/editor"

TEST_FILE="src/utils/__tests__/markdownActions.test.ts"
ACTION="${1:-all}"

case "$ACTION" in
  all)
    echo "전체 테스트 실행 (28개)"
    npx vitest run "$TEST_FILE" --reporter verbose
    ;;
  h1)       npx vitest run "$TEST_FILE" -t "H1" --reporter verbose ;;
  h2)       npx vitest run "$TEST_FILE" -t "H2" --reporter verbose ;;
  h3)       npx vitest run "$TEST_FILE" -t "H3" --reporter verbose ;;
  h4)       npx vitest run "$TEST_FILE" -t "H4" --reporter verbose ;;
  h5)       npx vitest run "$TEST_FILE" -t "H5" --reporter verbose ;;
  h6)       npx vitest run "$TEST_FILE" -t "H6" --reporter verbose ;;
  heading)  npx vitest run "$TEST_FILE" -t "Headings" --reporter verbose ;;
  bold)     npx vitest run "$TEST_FILE" -t "Bold" --reporter verbose ;;
  italic)   npx vitest run "$TEST_FILE" -t "Italic" --reporter verbose ;;
  strike)   npx vitest run "$TEST_FILE" -t "Strikethrough" --reporter verbose ;;
  code)     npx vitest run "$TEST_FILE" -t "Inline Code" --reporter verbose ;;
  ul)       npx vitest run "$TEST_FILE" -t "Unordered List" --reporter verbose ;;
  ol)       npx vitest run "$TEST_FILE" -t "Ordered List" --reporter verbose ;;
  task)     npx vitest run "$TEST_FILE" -t "Task List" --reporter verbose ;;
  list)     npx vitest run "$TEST_FILE" -t "List" --reporter verbose ;;
  quote)    npx vitest run "$TEST_FILE" -t "Blockquote" --reporter verbose ;;
  codeblock) npx vitest run "$TEST_FILE" -t "Code Block" --reporter verbose ;;
  hr)       npx vitest run "$TEST_FILE" -t "Horizontal" --reporter verbose ;;
  link)     npx vitest run "$TEST_FILE" -t "Link" --reporter verbose ;;
  image)    npx vitest run "$TEST_FILE" -t "Image" --reporter verbose ;;
  table)    npx vitest run "$TEST_FILE" -t "Table" --reporter verbose ;;
  math)     npx vitest run "$TEST_FILE" -t "Math" --reporter verbose ;;
  inline-math) npx vitest run "$TEST_FILE" -t "Inline Math" --reporter verbose ;;
  math-block)  npx vitest run "$TEST_FILE" -t "Math Block" --reporter verbose ;;
  combo)    npx vitest run "$TEST_FILE" -t "복합" --reporter verbose ;;
  int)      npx vitest run "$TEST_FILE" -t "통합" --reporter verbose ;;
  help|--help|-h)
    echo "사용법: ./scripts/item-test.sh <action>"
    echo ""
    echo "  all          전체 테스트 (28개)"
    echo "  int          통합 테스트 (22개 액션 한 문서)"
    echo "  combo        복합 렌더링 테스트"
    echo ""
    echo "  개별 액션:"
    echo "  h1~h6        Heading 1~6"
    echo "  heading      Heading 전체 (1~6)"
    echo "  bold         Bold (**text**)"
    echo "  italic       Italic (*text*)"
    echo "  strike       Strikethrough (~~text~~)"
    echo "  code         Inline Code (\`code\`)"
    echo "  ul           Unordered List (- item)"
    echo "  ol           Ordered List (1. item)"
    echo "  task         Task List (- [ ] item)"
    echo "  list         리스트 전체 (ul, ol, task)"
    echo "  quote        Blockquote (> text)"
    echo "  codeblock    Code Block (\`\`\`code\`\`\`)"
    echo "  hr           Horizontal Rule (---)"
    echo "  link         Link ([text](url))"
    echo "  image        Image (![alt](url))"
    echo "  table        Table (| col |)"
    echo "  math         Math 전체 (inline + block)"
    echo "  inline-math  Inline Math (\$formula\$)"
    echo "  math-block   Math Block (\$\$formula\$\$)"
    ;;
  *)
    echo "알 수 없는 액션: $ACTION"
    echo "./scripts/item-test.sh help 로 사용법을 확인하세요."
    exit 1
    ;;
esac
