// ─── Markdown Insertion Actions ───────────────────────────────────────────────
// Each action receives the EditorView and mutates the document/selection.

import { EditorView } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'
import type { ToolbarAction } from '../types'

/** Wrap selected text (or insert placeholder) with prefix/suffix */
function wrapSelection(
  view: EditorView,
  prefix: string,
  suffix: string,
  placeholder: string
): void {
  const { state, dispatch } = view
  const changes = state.changeByRange((range) => {
    const selected = state.sliceDoc(range.from, range.to)
    const text = selected.length ? selected : placeholder
    const inserted = prefix + text + suffix
    return {
      changes: { from: range.from, to: range.to, insert: inserted },
      range: EditorSelection.range(
        range.from + prefix.length,
        range.from + prefix.length + text.length
      ),
    }
  })
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input' }))
  view.focus()
}

/** Insert text at the beginning of each selected line */
function prefixLines(view: EditorView, getPrefix: (lineNum: number) => string): void {
  const { state, dispatch } = view
  const changes = state.changeByRange((range) => {
    const fromLine = state.doc.lineAt(range.from)
    const toLine = state.doc.lineAt(range.to)
    const inserts: { from: number; insert: string }[] = []
    let offset = 0

    for (let ln = fromLine.number; ln <= toLine.number; ln++) {
      const line = state.doc.line(ln)
      const prefix = getPrefix(ln - fromLine.number + 1)
      inserts.push({ from: line.from + offset, insert: prefix })
      offset += prefix.length
    }

    return {
      changes: inserts,
      range: EditorSelection.range(
        range.from + getPrefix(1).length,
        range.to + offset
      ),
    }
  })
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input' }))
  view.focus()
}

/** Insert a block (code block, etc.) around selection or at cursor */
function insertBlock(view: EditorView, open: string, close: string, placeholder: string): void {
  const { state, dispatch } = view
  const main = state.selection.main
  const selected = state.sliceDoc(main.from, main.to)
  const content = selected || placeholder
  const text = `\n${open}\n${content}\n${close}\n`
  const insertFrom = main.from

  dispatch(
    state.update({
      changes: { from: main.from, to: main.to, insert: text },
      selection: EditorSelection.cursor(
        insertFrom + open.length + 2 + content.length
      ),
      scrollIntoView: true,
      userEvent: 'input',
    })
  )
  view.focus()
}

/** Insert text at cursor (or replace selection) */
function insertText(view: EditorView, text: string): void {
  const { state, dispatch } = view
  const main = state.selection.main
  dispatch(
    state.update({
      changes: { from: main.from, to: main.to, insert: text },
      selection: EditorSelection.cursor(main.from + text.length),
      scrollIntoView: true,
      userEvent: 'input',
    })
  )
  view.focus()
}

// ─── Public action dispatcher ─────────────────────────────────────────────────

export function applyToolbarAction(view: EditorView, action: ToolbarAction): void {
  switch (action.type) {
    case 'heading':
      prefixLines(view, () => '#'.repeat(action.level) + ' ')
      break

    case 'bold':
      wrapSelection(view, '**', '**', 'bold text')
      break

    case 'italic':
      wrapSelection(view, '*', '*', 'italic text')
      break

    case 'strikethrough':
      wrapSelection(view, '~~', '~~', 'strikethrough')
      break

    case 'code':
      wrapSelection(view, '`', '`', 'code')
      break

    case 'codeblock': {
      const lang = action.lang ?? ''
      insertBlock(view, '```' + lang, '```', 'your code here')
      break
    }

    case 'blockquote':
      prefixLines(view, () => '> ')
      break

    case 'ul':
      prefixLines(view, () => '- ')
      break

    case 'ol':
      prefixLines(view, (n) => `${n}. `)
      break

    case 'task':
      prefixLines(view, () => '- [ ] ')
      break

    case 'link': {
      const { state } = view
      const selected = state.sliceDoc(state.selection.main.from, state.selection.main.to)
      const linkText = selected || 'link text'
      wrapSelection(view, '[', '](https://)', linkText)
      break
    }

    case 'image':
      insertText(view, '![alt text](https://)')
      break

    case 'table':
      insertText(
        view,
        '\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n'
      )
      break

    case 'hr':
      insertText(view, '\n---\n')
      break

    case 'math-inline':
      wrapSelection(view, '$', '$', 'formula')
      break

    case 'math-block':
      insertBlock(view, '$$', '$$', 'formula')
      break
  }
}
