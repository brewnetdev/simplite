import React2, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { PenLine, Eye, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Bold, Italic, Strikethrough, Code, List, ListOrdered, ListChecks, Quote, SquareCode, Minus, Link, Image, Table, Sigma, SquareSigma, Moon, Sun, Columns2 } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { EditorView, keymap, scrollPastEnd, placeholder } from '@codemirror/view';
import { Compartment, EditorState, EditorSelection } from '@codemirror/state';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { deepmerge } from 'deepmerge-ts';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function Btn({ title, onClick, active, children }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      title,
      onClick,
      className: `mf-toolbar-btn ${active ? "mf-toolbar-btn-active" : ""}`,
      children
    }
  );
}
function Sep() {
  return /* @__PURE__ */ jsx("div", { className: "mf-toolbar-sep" });
}
var ICON_SIZE = 14;
var headingIcons = [Heading1, Heading2, Heading3, Heading4, Heading5, Heading6];
function Toolbar({ onAction, layout, onLayoutChange, theme, onThemeChange }) {
  const act = useCallback(
    (action) => onAction(action),
    [onAction]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "mf-toolbar",
      role: "toolbar",
      "aria-label": "Markdown formatting toolbar",
      children: [
        [1, 2, 3, 4, 5, 6].map((n) => {
          const Icon = headingIcons[n - 1];
          return /* @__PURE__ */ jsx(Btn, { title: `Heading ${n} (Ctrl+Alt+${n})`, onClick: () => act({ type: "heading", level: n }), children: /* @__PURE__ */ jsx(Icon, { size: ICON_SIZE }) }, n);
        }),
        /* @__PURE__ */ jsx(Sep, {}),
        /* @__PURE__ */ jsx(Btn, { title: "Bold (Ctrl+B)", onClick: () => act({ type: "bold" }), children: /* @__PURE__ */ jsx(Bold, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Italic (Ctrl+I)", onClick: () => act({ type: "italic" }), children: /* @__PURE__ */ jsx(Italic, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Strikethrough", onClick: () => act({ type: "strikethrough" }), children: /* @__PURE__ */ jsx(Strikethrough, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Inline code (Ctrl+`)", onClick: () => act({ type: "code" }), children: /* @__PURE__ */ jsx(Code, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Sep, {}),
        /* @__PURE__ */ jsx(Btn, { title: "Unordered list", onClick: () => act({ type: "ul" }), children: /* @__PURE__ */ jsx(List, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Ordered list", onClick: () => act({ type: "ol" }), children: /* @__PURE__ */ jsx(ListOrdered, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Task list", onClick: () => act({ type: "task" }), children: /* @__PURE__ */ jsx(ListChecks, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Sep, {}),
        /* @__PURE__ */ jsx(Btn, { title: "Blockquote", onClick: () => act({ type: "blockquote" }), children: /* @__PURE__ */ jsx(Quote, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Code block (Ctrl+Shift+K)", onClick: () => act({ type: "codeblock" }), children: /* @__PURE__ */ jsx(SquareCode, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Horizontal rule", onClick: () => act({ type: "hr" }), children: /* @__PURE__ */ jsx(Minus, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Sep, {}),
        /* @__PURE__ */ jsx(Btn, { title: "Link (Ctrl+K)", onClick: () => act({ type: "link" }), children: /* @__PURE__ */ jsx(Link, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Image", onClick: () => act({ type: "image" }), children: /* @__PURE__ */ jsx(Image, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Table", onClick: () => act({ type: "table" }), children: /* @__PURE__ */ jsx(Table, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Sep, {}),
        /* @__PURE__ */ jsx(Btn, { title: "Inline math ($...$)", onClick: () => act({ type: "math-inline" }), children: /* @__PURE__ */ jsx(Sigma, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsx(Btn, { title: "Math block ($$...$$)", onClick: () => act({ type: "math-block" }), children: /* @__PURE__ */ jsx(SquareSigma, { size: ICON_SIZE }) }),
        /* @__PURE__ */ jsxs("div", { className: "mf-toolbar-spacer", children: [
          /* @__PURE__ */ jsx(Sep, {}),
          /* @__PURE__ */ jsx(
            Btn,
            {
              title: `Switch to ${theme === "light" ? "dark" : "light"} mode`,
              onClick: () => onThemeChange(theme === "light" ? "dark" : "light"),
              children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: ICON_SIZE }) : /* @__PURE__ */ jsx(Sun, { size: ICON_SIZE })
            }
          ),
          /* @__PURE__ */ jsx(Sep, {}),
          /* @__PURE__ */ jsx(Btn, { title: "Editor only", active: layout === "editor", onClick: () => onLayoutChange("editor"), children: /* @__PURE__ */ jsx(PenLine, { size: ICON_SIZE }) }),
          /* @__PURE__ */ jsx(Btn, { title: "Split view", active: layout === "split", onClick: () => onLayoutChange("split"), children: /* @__PURE__ */ jsx(Columns2, { size: ICON_SIZE }) }),
          /* @__PURE__ */ jsx(Btn, { title: "Preview only", active: layout === "preview", onClick: () => onLayoutChange("preview"), children: /* @__PURE__ */ jsx(Eye, { size: ICON_SIZE }) })
        ] })
      ]
    }
  );
}
var themeCompartment = new Compartment();
var readOnlyCompartment = new Compartment();
var placeholderCompartment = new Compartment();
var lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      height: "100%",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: "13px"
    },
    ".cm-content": { padding: "12px 16px", caretColor: "#2563eb" },
    ".cm-line": { padding: "0" },
    ".cm-cursor": { borderLeftColor: "#2563eb" },
    ".cm-selectionBackground, ::selection": { backgroundColor: "#bfdbfe" },
    ".cm-gutters": {
      backgroundColor: "#f9fafb",
      color: "#9ca3af",
      borderRight: "1px solid #e5e7eb"
    },
    ".cm-activeLine": { backgroundColor: "#f0f9ff" },
    ".cm-activeLineGutter": { backgroundColor: "#e0f2fe" },
    ".cm-placeholder": { color: "#9ca3af" },
    // Markdown-specific token colours
    ".cm-header": { color: "#1e40af", fontWeight: "bold" },
    ".cm-strong": { color: "#1f2937", fontWeight: "bold" },
    ".cm-em": { color: "#4b5563", fontStyle: "italic" },
    ".cm-link": { color: "#2563eb" },
    ".cm-url": { color: "#6b7280" },
    ".cm-code": { color: "#7c3aed", backgroundColor: "#f5f3ff", borderRadius: "3px" },
    ".cm-monospace": { fontFamily: "inherit" }
  },
  { dark: false }
);
var EditorPane = React2.forwardRef(
  function EditorPane2({ value, onChange, theme, placeholder: placeholder$1, readOnly = false, onScrollRatio }, ref) {
    const containerRef = useRef(null);
    const viewRef = useRef(null);
    const isExternalUpdate = useRef(false);
    const setRef = useCallback(
      (view) => {
        viewRef.current = view;
        if (typeof ref === "function") ref(view);
        else if (ref) ref.current = view;
      },
      [ref]
    );
    useEffect(() => {
      if (!containerRef.current) return;
      const view = new EditorView({
        state: EditorState.create({
          doc: value != null ? value : "",
          extensions: [
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
            EditorView.lineWrapping,
            scrollPastEnd(),
            themeCompartment.of(theme === "dark" ? oneDark : lightTheme),
            readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),
            placeholderCompartment.of(
              placeholder(placeholder$1 != null ? placeholder$1 : "Start writing Markdown\u2026")
            ),
            EditorView.updateListener.of((update) => {
              if (update.docChanged && !isExternalUpdate.current) {
                onChange(update.state.doc.toString());
              }
            }),
            EditorView.domEventHandlers({
              scroll(event, view2) {
                const el = view2.scrollDOM;
                const ratio = el.scrollHeight === el.clientHeight ? 0 : el.scrollTop / (el.scrollHeight - el.clientHeight);
                onScrollRatio == null ? void 0 : onScrollRatio(ratio);
              }
            })
          ]
        }),
        parent: containerRef.current
      });
      setRef(view);
      return () => {
        view.destroy();
        setRef(null);
      };
    }, []);
    useEffect(() => {
      const view = viewRef.current;
      if (!view) return;
      const current = view.state.doc.toString();
      if (current === value) return;
      isExternalUpdate.current = true;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value != null ? value : "" }
      });
      isExternalUpdate.current = false;
    }, [value]);
    useEffect(() => {
      var _a;
      (_a = viewRef.current) == null ? void 0 : _a.dispatch({
        effects: themeCompartment.reconfigure(theme === "dark" ? oneDark : lightTheme)
      });
    }, [theme]);
    useEffect(() => {
      var _a;
      (_a = viewRef.current) == null ? void 0 : _a.dispatch({
        effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly))
      });
    }, [readOnly]);
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: "mf-editor-container",
        "aria-label": "Markdown source editor"
      }
    );
  }
);
EditorPane.displayName = "EditorPane";
var sanitizeSchema = deepmerge(defaultSchema, {
  attributes: {
    code: ["className"],
    span: ["className", "style", "aria-hidden"],
    div: ["className", "style"],
    "*": ["className"]
  },
  tagNames: [
    "math",
    "semantics",
    "mrow",
    "mi",
    "mo",
    "mn",
    "mfrac",
    "msqrt",
    "mroot",
    "msup",
    "msub",
    "msubsup",
    "annotation",
    "annotation-xml",
    "menclose",
    "mtext",
    "mspace",
    "mtable",
    "mtr",
    "mtd"
  ]
});
var processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkRehype, { allowDangerousHtml: false }).use(rehypeHighlight, { detect: true, ignoreMissing: true }).use(rehypeKatex).use(rehypeSanitize, sanitizeSchema).use(rehypeStringify);
function parseMarkdown(markdown2) {
  if (!markdown2.trim()) return "";
  try {
    return String(processor.processSync(markdown2));
  } catch (e) {
    return '<p style="color:red">\u26A0 Parse error</p>';
  }
}
function PreviewPane({ markdown: markdown2, theme, scrollRatio, onScrollRatio }) {
  const containerRef = useRef(null);
  const isScrollingFromEditor = useRef(false);
  const html = useMemo(() => parseMarkdown(markdown2), [markdown2]);
  useEffect(() => {
    if (scrollRatio === void 0) return;
    const el = containerRef.current;
    if (!el) return;
    isScrollingFromEditor.current = true;
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
    requestAnimationFrame(() => {
      isScrollingFromEditor.current = false;
    });
  }, [scrollRatio]);
  const handleScroll = () => {
    if (isScrollingFromEditor.current) return;
    const el = containerRef.current;
    if (!el) return;
    const ratio = el.scrollHeight === el.clientHeight ? 0 : el.scrollTop / (el.scrollHeight - el.clientHeight);
    onScrollRatio == null ? void 0 : onScrollRatio(ratio);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      onScroll: handleScroll,
      className: "mf-preview-container",
      "aria-label": "Markdown preview",
      children: html ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "mf-preview",
          dangerouslySetInnerHTML: { __html: html }
        }
      ) : /* @__PURE__ */ jsx("p", { className: "mf-preview-empty", children: "Nothing to preview yet\u2026" })
    }
  );
}
function wrapSelection(view, prefix, suffix, placeholder) {
  const { state, dispatch } = view;
  const changes = state.changeByRange((range) => {
    const selected = state.sliceDoc(range.from, range.to);
    const text = selected.length ? selected : placeholder;
    const inserted = prefix + text + suffix;
    return {
      changes: { from: range.from, to: range.to, insert: inserted },
      range: EditorSelection.range(
        range.from + prefix.length,
        range.from + prefix.length + text.length
      )
    };
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
  view.focus();
}
function prefixLines(view, getPrefix) {
  const { state, dispatch } = view;
  const changes = state.changeByRange((range) => {
    const fromLine = state.doc.lineAt(range.from);
    const toLine = state.doc.lineAt(range.to);
    const inserts = [];
    let offset = 0;
    for (let ln = fromLine.number; ln <= toLine.number; ln++) {
      const line = state.doc.line(ln);
      const prefix = getPrefix(ln - fromLine.number + 1);
      inserts.push({ from: line.from + offset, insert: prefix });
      offset += prefix.length;
    }
    return {
      changes: inserts,
      range: EditorSelection.range(
        range.from + getPrefix(1).length,
        range.to + offset
      )
    };
  });
  dispatch(state.update(changes, { scrollIntoView: true, userEvent: "input" }));
  view.focus();
}
function insertBlock(view, open, close, placeholder) {
  const { state, dispatch } = view;
  const main = state.selection.main;
  const selected = state.sliceDoc(main.from, main.to);
  const content = selected || placeholder;
  const text = `
${open}
${content}
${close}
`;
  const insertFrom = main.from;
  dispatch(
    state.update({
      changes: { from: main.from, to: main.to, insert: text },
      selection: EditorSelection.cursor(
        insertFrom + open.length + 2 + content.length
      ),
      scrollIntoView: true,
      userEvent: "input"
    })
  );
  view.focus();
}
function insertText(view, text) {
  const { state, dispatch } = view;
  const main = state.selection.main;
  dispatch(
    state.update({
      changes: { from: main.from, to: main.to, insert: text },
      selection: EditorSelection.cursor(main.from + text.length),
      scrollIntoView: true,
      userEvent: "input"
    })
  );
  view.focus();
}
function applyToolbarAction(view, action) {
  var _a;
  switch (action.type) {
    case "heading":
      prefixLines(view, () => "#".repeat(action.level) + " ");
      break;
    case "bold":
      wrapSelection(view, "**", "**", "bold text");
      break;
    case "italic":
      wrapSelection(view, "*", "*", "italic text");
      break;
    case "strikethrough":
      wrapSelection(view, "~~", "~~", "strikethrough");
      break;
    case "code":
      wrapSelection(view, "`", "`", "code");
      break;
    case "codeblock": {
      const lang = (_a = action.lang) != null ? _a : "";
      insertBlock(view, "```" + lang, "```", "your code here");
      break;
    }
    case "blockquote":
      prefixLines(view, () => "> ");
      break;
    case "ul":
      prefixLines(view, () => "- ");
      break;
    case "ol":
      prefixLines(view, (n) => `${n}. `);
      break;
    case "task":
      prefixLines(view, () => "- [ ] ");
      break;
    case "link": {
      const { state } = view;
      const selected = state.sliceDoc(state.selection.main.from, state.selection.main.to);
      const linkText = selected || "link text";
      wrapSelection(view, "[", "](https://)", linkText);
      break;
    }
    case "image":
      insertText(view, "![alt text](https://)");
      break;
    case "table":
      insertText(
        view,
        "\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n"
      );
      break;
    case "hr":
      insertText(view, "\n---\n");
      break;
    case "math-inline":
      wrapSelection(view, "$", "$", "formula");
      break;
    case "math-block":
      insertBlock(view, "$$", "$$", "formula");
      break;
  }
}
var DEFAULT_CONTENT = `# Welcome to MarkFlow Editor

Write **Markdown** here and see a live preview on the right.

## Features

- CommonMark 0.28 + GFM (tables, task lists, strikethrough)
- Syntax-highlighted code blocks
- Math with KaTeX: $E = mc^2$
- Mermaid diagrams *(coming soon)*

## Code example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`
}
\`\`\`

## Table

| Feature | Status |
| --- | --- |
| Dual view | \u2705 |
| Toolbar | \u2705 |
| Scroll sync | \u2705 |

> **Tip:** Use the toolbar above or keyboard shortcuts to format text.

---

[MarkFlow Docs](https://markflow.io)
`;
function MarkdownEditor({
  value,
  defaultValue,
  onChange,
  layout: layoutProp = "split",
  theme: themeProp = "light",
  height = "600px",
  placeholder,
  readOnly = false,
  className = "",
  themeVars
}) {
  const [internalValue, setInternalValue] = useState(
    defaultValue != null ? defaultValue : DEFAULT_CONTENT
  );
  const [layout, setLayout] = useState(layoutProp);
  const [theme, setTheme] = useState(themeProp);
  const [editorScrollRatio, setEditorScrollRatio] = useState(0);
  const [previewScrollRatio, setPreviewScrollRatio] = useState(0);
  const isControlled = value !== void 0;
  const markdown2 = isControlled ? value != null ? value : "" : internalValue;
  const editorViewRef = useRef(null);
  const handleChange = useCallback(
    (newValue) => {
      if (!isControlled) setInternalValue(newValue);
      onChange == null ? void 0 : onChange(newValue);
    },
    [isControlled, onChange]
  );
  const handleToolbarAction = useCallback((action) => {
    if (!editorViewRef.current) return;
    applyToolbarAction(editorViewRef.current, action);
  }, []);
  const handleEditorScroll = useCallback((ratio) => {
    setPreviewScrollRatio(ratio);
  }, []);
  const handlePreviewScroll = useCallback((ratio) => {
    setEditorScrollRatio(ratio);
  }, []);
  const showEditor = layout === "split" || layout === "editor";
  const showPreview = layout === "split" || layout === "preview";
  const rootStyle = __spreadValues({
    height
  }, themeVars);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `mf-root mf-editor-root ${className}`,
      "data-theme": theme,
      style: rootStyle,
      children: [
        /* @__PURE__ */ jsx(
          Toolbar,
          {
            onAction: handleToolbarAction,
            layout,
            onLayoutChange: setLayout,
            theme,
            onThemeChange: setTheme
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mf-panes-container", children: [
          showEditor && /* @__PURE__ */ jsxs(
            "div",
            {
              className: [
                "mf-pane-wrapper",
                showPreview ? "mf-pane-half" : "mf-pane-full",
                showPreview ? "mf-pane-border-right" : ""
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mf-pane-header", children: [
                  /* @__PURE__ */ jsx(PenLine, { size: 10 }),
                  "Editor"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mf-pane-content", children: /* @__PURE__ */ jsx(
                  EditorPane,
                  {
                    ref: editorViewRef,
                    value: markdown2,
                    onChange: handleChange,
                    theme,
                    placeholder,
                    readOnly,
                    onScrollRatio: handleEditorScroll,
                    scrollRatio: editorScrollRatio
                  }
                ) })
              ]
            }
          ),
          showPreview && /* @__PURE__ */ jsxs(
            "div",
            {
              className: [
                "mf-pane-wrapper",
                showEditor ? "mf-pane-half" : "mf-pane-full"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsxs("div", { className: "mf-pane-header", children: [
                  /* @__PURE__ */ jsx(Eye, { size: 10 }),
                  "Preview"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mf-pane-content", children: /* @__PURE__ */ jsx(
                  PreviewPane,
                  {
                    markdown: markdown2,
                    theme,
                    scrollRatio: previewScrollRatio,
                    onScrollRatio: handlePreviewScroll
                  }
                ) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mf-statusbar", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            markdown2.split("\n").length,
            " lines \xB7 ",
            markdown2.length,
            " chars"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "mf-statusbar-right", children: [
            readOnly && /* @__PURE__ */ jsx("span", { className: "mf-readonly-badge", children: "READ ONLY" }),
            /* @__PURE__ */ jsx("span", { children: "CommonMark 0.28 + GFM" })
          ] })
        ] })
      ]
    }
  );
}

export { MarkdownEditor, applyToolbarAction, parseMarkdown };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map