import * as react_jsx_runtime from 'react/jsx-runtime';
import { EditorView } from '@codemirror/view';

type EditorLayout = 'split' | 'editor' | 'preview';
type EditorTheme = 'light' | 'dark';
interface MarkdownEditorProps {
    /** Current markdown content (controlled) */
    value?: string;
    /** Default content (uncontrolled) */
    defaultValue?: string;
    /** Called whenever content changes */
    onChange?: (value: string) => void;
    /** Editor + preview layout */
    layout?: EditorLayout;
    /** Color theme */
    theme?: EditorTheme;
    /** Editor height (CSS value, e.g. "600px", "100vh") */
    height?: string;
    /** Placeholder shown in empty editor */
    placeholder?: string;
    /** Whether editor is read-only */
    readOnly?: boolean;
    /** Custom CSS class on the root element */
    className?: string;
    /** Custom CSS variables for theme overrides */
    themeVars?: Record<string, string>;
}
interface EditorPaneProps {
    value: string;
    onChange: (value: string) => void;
    theme: EditorTheme;
    placeholder?: string;
    readOnly?: boolean;
    onScrollRatio?: (ratio: number) => void;
    scrollRatio?: number;
}
interface PreviewPaneProps {
    markdown: string;
    theme: EditorTheme;
    scrollRatio?: number;
    onScrollRatio?: (ratio: number) => void;
}
interface ToolbarProps {
    onAction: (action: ToolbarAction) => void;
    layout: EditorLayout;
    onLayoutChange: (layout: EditorLayout) => void;
    theme: EditorTheme;
    onThemeChange: (theme: EditorTheme) => void;
}
type ToolbarAction = {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
} | {
    type: 'bold';
} | {
    type: 'italic';
} | {
    type: 'strikethrough';
} | {
    type: 'code';
} | {
    type: 'codeblock';
    lang?: string;
} | {
    type: 'blockquote';
} | {
    type: 'ul';
} | {
    type: 'ol';
} | {
    type: 'task';
} | {
    type: 'link';
} | {
    type: 'image';
} | {
    type: 'table';
} | {
    type: 'hr';
} | {
    type: 'math-inline';
} | {
    type: 'math-block';
};

declare function MarkdownEditor({ value, defaultValue, onChange, layout: layoutProp, theme: themeProp, height, placeholder, readOnly, className, themeVars, }: MarkdownEditorProps): react_jsx_runtime.JSX.Element;

/**
 * Convert markdown string → safe HTML string.
 * Synchronous via processSync — suitable for real-time preview.
 */
declare function parseMarkdown(markdown: string): string;

declare function applyToolbarAction(view: EditorView, action: ToolbarAction): void;

export { type EditorLayout, type EditorPaneProps, type EditorTheme, MarkdownEditor, type MarkdownEditorProps, type PreviewPaneProps, type ToolbarAction, type ToolbarProps, applyToolbarAction, parseMarkdown };
