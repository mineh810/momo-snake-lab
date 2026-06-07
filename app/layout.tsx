import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Momo Snake Lab',
  description: 'A tiny agent-native Snake MVP with Silicon Valley AI startup taste.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
