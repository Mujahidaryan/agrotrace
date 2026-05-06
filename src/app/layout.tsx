import type { Metadata } from 'next';
import { Instrument_Serif, Barlow, Barlow_Condensed } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument',
});
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
});
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-condensed',
});

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
    <html lang="en" className={`${instrumentSerif.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
