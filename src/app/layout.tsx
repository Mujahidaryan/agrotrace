import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgroTrace — Pakistan Agricultural Intelligence Platform',
  description: 'Real-time visibility across Pakistan\'s agricultural supply chains',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
