import { Fragment, type ReactNode } from 'react';

interface RichTextProps {
  text: string;
  /** Classe aplicada aos trechos `**negrito**`. */
  strongClassName?: string;
}

/**
 * Renderiza strings de tradução com a mini-sintaxe usada em `messages/*.json`:
 * cada `<br/>` ou `\n` vira um `<br>` (`\n\n` → dois), `**x**` vira `<strong>`.
 * Tudo é montado como elementos React (escapados), nunca como HTML cru.
 */
export default function RichText({ text, strongClassName }: RichTextProps) {
  const lines = text.split(/<br\s*\/?>|\n/i);

  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderBold(line, strongClassName)}
        </Fragment>
      ))}
    </>
  );
}

function renderBold(line: string, strongClassName?: string): ReactNode[] {
  // split com grupo de captura: índices ímpares são o conteúdo entre `**`
  return line.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClassName}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
