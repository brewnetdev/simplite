// ─── Markdown → HTML Pipeline (remark + rehype) ────────────────────────────────

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { deepmerge } from 'deepmerge-ts'

// Extend sanitize schema to allow code class names (for syntax highlighting)
// and KaTeX-generated classes
const sanitizeSchema = deepmerge(defaultSchema, {
  attributes: {
    code: ['className'],
    span: ['className', 'style', 'aria-hidden'],
    div: ['className', 'style'],
    '*': ['className'],
  },
  tagNames: [
    'math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'mfrac',
    'msqrt', 'mroot', 'msup', 'msub', 'msubsup', 'annotation',
    'annotation-xml', 'menclose', 'mtext', 'mspace', 'mtable',
    'mtr', 'mtd',
  ],
} as typeof defaultSchema)

// Singleton processor — built once, reused every render call
const processor = unified()
  .use(remarkParse)                    // CommonMark parsing
  .use(remarkGfm)                      // GitHub Flavored Markdown (tables, task lists, strikethrough)
  .use(remarkMath)                     // $...$ and $$...$$ math blocks
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeHighlight, { detect: true, ignoreMissing: true })  // code syntax highlighting
  .use(rehypeKatex)                    // render math with KaTeX
  .use(rehypeSanitize, sanitizeSchema) // XSS protection
  .use(rehypeStringify)

/**
 * Convert markdown string → safe HTML string.
 * Synchronous via processSync — suitable for real-time preview.
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown.trim()) return ''
  try {
    return String(processor.processSync(markdown))
  } catch {
    return '<p style="color:red">⚠ Parse error</p>'
  }
}
