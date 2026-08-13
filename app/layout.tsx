import type {Metadata} from 'next';
import { Fraunces, Inter, Playfair_Display, Hanken_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Harmony Homes | Luxury Modernist Builder',
  description: 'Bespoke high-end architectural masterpieces, crafted with precision, control, and absolute discretion.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${hanken.variable} ${fraunces.variable} ${playfair.variable} ${inter.variable} antialiased bg-[#F9F9F7] text-[#1C1C1A]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

