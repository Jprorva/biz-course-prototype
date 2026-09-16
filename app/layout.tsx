import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Бизнес: от идеи к системе — СберБизнес Live',
  description: 'Практический курс для предпринимателей: 9 уроков от проверки идеи до плана роста.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
