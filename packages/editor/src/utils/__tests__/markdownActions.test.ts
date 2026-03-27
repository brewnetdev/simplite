import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../parseMarkdown';

/**
 * 22개 툴바 액션의 마크다운 → HTML 변환을 검증합니다.
 * 각 액션이 삽입하는 마크다운 문법이 올바르게 렌더링되는지 확인합니다.
 */

// Helper: HTML 태그 존재 여부 확인
function html(md: string): string {
  return parseMarkdown(md);
}

describe('Toolbar Action: Headings (1-6)', () => {
  it('H1 — # heading', () => {
    expect(html('# Heading 1')).toContain('<h1>Heading 1</h1>');
  });

  it('H2 — ## heading', () => {
    expect(html('## Heading 2')).toContain('<h2>Heading 2</h2>');
  });

  it('H3 — ### heading', () => {
    expect(html('### Heading 3')).toContain('<h3>Heading 3</h3>');
  });

  it('H4 — #### heading', () => {
    expect(html('#### Heading 4')).toContain('<h4>Heading 4</h4>');
  });

  it('H5 — ##### heading', () => {
    expect(html('##### Heading 5')).toContain('<h5>Heading 5</h5>');
  });

  it('H6 — ###### heading', () => {
    expect(html('###### Heading 6')).toContain('<h6>Heading 6</h6>');
  });
});

describe('Toolbar Action: Bold', () => {
  it('**bold text** → <strong>', () => {
    expect(html('**bold text**')).toContain('<strong>bold text</strong>');
  });

  it('문장 내부 볼드', () => {
    expect(html('this is **bold** word')).toContain('<strong>bold</strong>');
  });
});

describe('Toolbar Action: Italic', () => {
  it('*italic text* → <em>', () => {
    expect(html('*italic text*')).toContain('<em>italic text</em>');
  });
});

describe('Toolbar Action: Strikethrough', () => {
  it('~~strikethrough~~ → <del> (remark-gfm)', () => {
    const result = html('~~strikethrough~~');
    expect(result).toContain('<del>strikethrough</del>');
  });

  it('공백 포함 시에도 적용: ~~hello world~~', () => {
    const result = html('~~hello world~~');
    expect(result).toContain('<del>hello world</del>');
  });

  it('~~text ~~ (후행 공백) — GFM 미인식', () => {
    const result = html('~~text ~~');
    // 후행 공백이 있으면 GFM이 strikethrough로 인식하지 않음
    expect(result).not.toContain('<del>');
  });
});

describe('Toolbar Action: Inline Code', () => {
  it('`code` → <code>', () => {
    const result = html('`inline code`');
    expect(result).toContain('<code>inline code</code>');
  });
});

describe('Toolbar Action: Unordered List', () => {
  it('- item → <ul><li>', () => {
    const result = html('- item 1\n- item 2\n- item 3');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item 1</li>');
    expect(result).toContain('<li>item 2</li>');
    expect(result).toContain('<li>item 3</li>');
    expect(result).toContain('</ul>');
  });
});

describe('Toolbar Action: Ordered List', () => {
  it('1. item → <ol><li>', () => {
    const result = html('1. first\n2. second\n3. third');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>first</li>');
    expect(result).toContain('<li>second</li>');
    expect(result).toContain('<li>third</li>');
    expect(result).toContain('</ol>');
  });
});

describe('Toolbar Action: Task List', () => {
  it('- [ ] task → checkbox input', () => {
    const result = html('- [ ] unchecked\n- [x] checked');
    expect(result).toContain('type="checkbox"');
    expect(result).toContain('unchecked');
    expect(result).toContain('checked');
  });
});

describe('Toolbar Action: Blockquote', () => {
  it('> text → <blockquote>', () => {
    const result = html('> quoted text');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('quoted text');
    expect(result).toContain('</blockquote>');
  });
});

describe('Toolbar Action: Code Block', () => {
  it('```code``` → <pre><code>', () => {
    const result = html('```\nhello world\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code');
    expect(result).toContain('hello world');
    expect(result).toContain('</pre>');
  });

  it('언어 지정 코드 블록', () => {
    const result = html('```javascript\nconst x = 1;\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code');
    // rehype-highlight가 span으로 감쌀 수 있으므로 텍스트 일부만 확인
    expect(result).toContain('const');
  });
});

describe('Toolbar Action: Horizontal Rule', () => {
  it('--- → <hr>', () => {
    const result = html('text above\n\n---\n\ntext below');
    expect(result).toContain('<hr>');
  });
});

describe('Toolbar Action: Link', () => {
  it('[text](url) → <a>', () => {
    const result = html('[link text](https://example.com)');
    expect(result).toContain('<a');
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('link text');
    expect(result).toContain('</a>');
  });
});

describe('Toolbar Action: Image', () => {
  it('![alt](url) → <img>', () => {
    const result = html('![alt text](https://example.com/img.png)');
    expect(result).toContain('<img');
    expect(result).toContain('src="https://example.com/img.png"');
    expect(result).toContain('alt="alt text"');
  });
});

describe('Toolbar Action: Table', () => {
  it('GFM table → <table>', () => {
    const md = '| Col 1 | Col 2 |\n| --- | --- |\n| A | B |';
    const result = html(md);
    expect(result).toContain('<table>');
    expect(result).toContain('<th>Col 1</th>');
    expect(result).toContain('<th>Col 2</th>');
    expect(result).toContain('<td>A</td>');
    expect(result).toContain('<td>B</td>');
    expect(result).toContain('</table>');
  });
});

describe('Toolbar Action: Inline Math', () => {
  it('$formula$ → KaTeX span', () => {
    const result = html('$E=mc^2$');
    expect(result).toContain('katex');
  });
});

describe('Toolbar Action: Math Block', () => {
  it('$$formula$$ → KaTeX display', () => {
    const result = html('$$\nE=mc^2\n$$');
    expect(result).toContain('katex-display');
  });
});

describe('복합 마크다운 렌더링', () => {
  it('볼드+이텔릭+스트라이크 별도 줄 — 빈 줄 없이는 한 단락', () => {
    const md = '**bold**\n*italic*\n~~strike~~';
    const result = html(md);
    // 빈 줄 없으면 같은 <p> 안에 들어감 (마크다운 표준)
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
    expect(result).toContain('<del>strike</del>');
    // 한 개의 <p> 태그 안에 모두 포함
    const pCount = (result.match(/<p>/g) ?? []).length;
    expect(pCount).toBe(1);
  });

  it('볼드+이텔릭+스트라이크 빈 줄 구분 — 별도 단락', () => {
    const md = '**bold**\n\n*italic*\n\n~~strike~~';
    const result = html(md);
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
    expect(result).toContain('<del>strike</del>');
    // 빈 줄이 있으면 각각 별도 <p>
    const pCount = (result.match(/<p>/g) ?? []).length;
    expect(pCount).toBe(3);
  });
});

describe('통합 테스트: 22개 액션 전체 마크다운 문서', () => {
  it('모든 툴바 액션의 마크다운을 하나의 문서로 합쳐 렌더링', () => {
    const fullDoc = [
      '# Heading 1',
      '## Heading 2',
      '### Heading 3',
      '#### Heading 4',
      '##### Heading 5',
      '###### Heading 6',
      '',
      '**bold text**',
      '',
      '*italic text*',
      '',
      '~~strikethrough~~',
      '',
      '`inline code`',
      '',
      '- bullet 1',
      '- bullet 2',
      '',
      '1. numbered 1',
      '2. numbered 2',
      '',
      '- [ ] unchecked task',
      '- [x] checked task',
      '',
      '> blockquote text',
      '',
      '```',
      'code block',
      '```',
      '',
      '---',
      '',
      '[link](https://example.com)',
      '',
      '![image](https://example.com/img.png)',
      '',
      '| Col 1 | Col 2 |',
      '| --- | --- |',
      '| A | B |',
      '',
      '$E=mc^2$',
      '',
      '$$',
      'formula',
      '$$',
    ].join('\n');

    const result = html(fullDoc);

    // Headings (1-6)
    expect(result).toContain('<h1>Heading 1</h1>');
    expect(result).toContain('<h2>Heading 2</h2>');
    expect(result).toContain('<h3>Heading 3</h3>');
    expect(result).toContain('<h4>Heading 4</h4>');
    expect(result).toContain('<h5>Heading 5</h5>');
    expect(result).toContain('<h6>Heading 6</h6>');

    // Inline formatting
    expect(result).toContain('<strong>bold text</strong>');
    expect(result).toContain('<em>italic text</em>');
    expect(result).toContain('<del>strikethrough</del>');
    expect(result).toContain('<code>inline code</code>');

    // Lists
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>bullet 1</li>');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>numbered 1</li>');

    // Task list
    expect(result).toContain('type="checkbox"');

    // Blockquote
    expect(result).toContain('<blockquote>');

    // Code block (rehype-highlight가 span으로 감쌈)
    expect(result).toContain('<pre>');
    expect(result).toContain('<code');

    // Horizontal rule
    expect(result).toContain('<hr>');

    // Link
    expect(result).toContain('href="https://example.com"');

    // Image
    expect(result).toContain('src="https://example.com/img.png"');

    // Table
    expect(result).toContain('<table>');
    expect(result).toContain('<th>Col 1</th>');

    // Math
    expect(result).toContain('katex');
    expect(result).toContain('katex-display');
  });
});
