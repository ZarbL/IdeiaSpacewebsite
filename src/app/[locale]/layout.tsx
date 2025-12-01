import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';
import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {routing} from '@/routing';

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IdeiaSpace - Connecting the World through Space Technology",
  description: "Transforming ideas into innovative space solutions. Cutting-edge technology for global communication.",
  keywords: ["space", "technology", "satellite", "innovation", "communication"],
  authors: [{ name: "IdeiaSpace" }],
  openGraph: {
    title: "IdeiaSpace - Space Technology",
    description: "Transforming ideas into innovative space solutions",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${robotoCondensed.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
