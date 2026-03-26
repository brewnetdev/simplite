'use client'

// ─── Demo page ────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { MarkdownEditor } from '@markflow/editor'
import '@markflow/editor/styles'

export default function Home() {
  const [value, setValue] = useState<string | undefined>(undefined)

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="mb-6 flex items-center gap-3">
        <span className="text-2xl">📝</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">MarkFlow Editor</h1>
          <p className="text-sm text-gray-500">Standalone Markdown Editor Component — Demo</p>
        </div>
        <div className="ml-auto flex gap-2 text-xs">
          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 font-semibold">
            CodeMirror 6
          </span>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 font-semibold">
            remark + rehype
          </span>
          <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 font-semibold">
            CommonMark 0.28 + GFM
          </span>
        </div>
      </header>

      {/* Editor */}
      <MarkdownEditor
        value={value}
        onChange={setValue}
        height="calc(100vh - 140px)"
        layout="split"
        theme="light"
        placeholder="Start writing Markdown…"
      />
    </div>
  )
}
