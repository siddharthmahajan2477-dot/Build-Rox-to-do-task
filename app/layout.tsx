import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RoxTasks — Your Tasks. Your Rules. Your Style.',
  description:
    'A premium, local-first to-do list and productivity dashboard crafted by Build Rox. Private, high performance, custom themes, and offline capability.',
  openGraph: {
    title: 'RoxTasks — Your Tasks. Your Rules. Your Style.',
    description:
      'A premium, local-first to-do list and productivity dashboard crafted by Build Rox.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RoxTasks — Your Tasks. Your Rules. Your Style.',
    description:
      'A premium, local-first to-do list and productivity dashboard crafted by Build Rox.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body suppressHydrationWarning className="bg-[#FAFBFC] text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-white">
        {children}
      </body>
    </html>
  );
}
