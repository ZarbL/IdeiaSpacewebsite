import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RichText from '../RichText';

function html(text: string, strongClassName?: string) {
  const { container } = render(<p><RichText text={text} strongClassName={strongClassName} /></p>);
  return container.innerHTML;
}

describe('RichText', () => {
  it('renderiza texto simples', () => {
    expect(html('olá mundo')).toBe('<p>olá mundo</p>');
  });

  it('converte <br/> e \\n em <br>', () => {
    expect(html('a<br/>b')).toBe('<p>a<br>b</p>');
    expect(html('a<br />b')).toBe('<p>a<br>b</p>');
    expect(html('a\nb')).toBe('<p>a<br>b</p>');
  });

  it('\\n\\n vira parágrafo (dois <br>), como o antigo formatDescription', () => {
    expect(html('a\n\n**Obj**\n\nb')).toBe('<p>a<br><br><strong>Obj</strong><br><br>b</p>');
  });

  it('converte **x** em <strong> com classe opcional', () => {
    expect(html('um **dois** três')).toBe('<p>um <strong>dois</strong> três</p>');
    expect(html('**x**', 'obj')).toBe('<p><strong class="obj">x</strong></p>');
  });

  it('não injeta HTML: tags viram texto escapado', () => {
    const out = html('<img src=x onerror=alert(1)> <script>alert(1)</script>');
    expect(out).not.toContain('<img');
    expect(out).not.toContain('<script');
    expect(out).toContain('&lt;img');
  });
});
