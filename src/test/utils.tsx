import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import en from '../../messages/en.json';
import es from '../../messages/es.json';
import pt from '../../messages/pt.json';

const messages = { en, es, pt };

/** Render com o provider do next-intl, usando as mensagens reais do locale. */
export function renderWithIntl(
  ui: ReactElement,
  { locale = 'pt', ...options }: { locale?: keyof typeof messages } & Omit<RenderOptions, 'wrapper'> = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}
