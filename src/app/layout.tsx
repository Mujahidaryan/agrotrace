import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgroTrace — Food Supply Intelligence Platform',
  description: 'Real-time food supply chain tracking for Sindh & Punjab. Monitor shipments, exports, and logistics intelligence.',
  keywords: ['food supply chain', 'Pakistan logistics', 'Sindh Punjab tracking', 'agricultural exports'],
  openGraph: {
    title: 'AgroTrace — Food Supply Intelligence Platform',
    description: 'Real-time food logistics intelligence for Pakistan and global exports.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
