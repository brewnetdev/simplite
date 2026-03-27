// ─── PreviewPane — remark-rendered HTML preview ───────────────────────────────

import React, { useEffect, useRef, useMemo, useImperativeHandle, forwardRef, useCallback } from 'react'
import { parseMarkdown } from '../utils/parseMarkdown'
import type { PreviewPaneProps, PreviewPaneHandle } from '../types'

export const PreviewPane = forwardRef<PreviewPaneHandle, PreviewPaneProps>(
  function PreviewPane({ markdown, scrollRatio, onScrollRatio }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isScrollingFromEditor = useRef(false)

    // Parse markdown → HTML (memoised — only recalculates when markdown changes)
    const html = useMemo(() => parseMarkdown(markdown), [markdown])

    // ── Expose scrollToHeading via ref ──────────────────────────────────────
    const scrollToHeading = useCallback((headingText: string) => {
      const el = containerRef.current
      if (!el) return

      const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const normalizedTarget = headingText.trim().toLowerCase()

      for (const heading of headings) {
        const text = (heading.textContent ?? '').trim().toLowerCase()
        if (text === normalizedTarget) {
          isScrollingFromEditor.current = true
          heading.scrollIntoView({ block: 'start', behavior: 'smooth' })

          // scrollend로 정확한 완료 시점 감지, 미지원 시 fallback 500ms
          const unlock = () => { isScrollingFromEditor.current = false }
          if ('onscrollend' in el) {
            el.addEventListener('scrollend', unlock, { once: true })
          } else {
            setTimeout(unlock, 500)
          }
          return
        }
      }
    }, [])

    useImperativeHandle(ref, () => ({ scrollToHeading }), [scrollToHeading])

    // ── Apply incoming scroll ratio from editor (fallback) ──────────────────
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
)
