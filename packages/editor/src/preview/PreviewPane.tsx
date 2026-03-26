// ─── PreviewPane — remark-rendered HTML preview ───────────────────────────────

import React, { useEffect, useRef, useMemo } from 'react'
import { parseMarkdown } from '../utils/parseMarkdown'
import type { PreviewPaneProps } from '../types'

export function PreviewPane({ markdown, theme, scrollRatio, onScrollRatio }: PreviewPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingFromEditor = useRef(false)

  // Parse markdown → HTML (memoised — only recalculates when markdown changes)
  const html = useMemo(() => parseMarkdown(markdown), [markdown])

  // ── Apply incoming scroll ratio from editor ───────────────────────────────
  useEffect(() => {
    if (scrollRatio === undefined) return
    const el = containerRef.current
    if (!el) return
    isScrollingFromEditor.current = true
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight)
    requestAnimationFrame(() => {
      isScrollingFromEditor.current = false
    })
  }, [scrollRatio])

  // ── Emit scroll ratio when user scrolls the preview ──────────────────────
  const handleScroll = () => {
    if (isScrollingFromEditor.current) return
    const el = containerRef.current
    if (!el) return
    const ratio =
      el.scrollHeight === el.clientHeight
        ? 0
        : el.scrollTop / (el.scrollHeight - el.clientHeight)
    onScrollRatio?.(ratio)
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="mf-preview-container"
      aria-label="Markdown preview"
    >
      {html ? (
        <div
          className="mf-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="mf-preview-empty">Nothing to preview yet…</p>
      )}
    </div>
  )
}
