import { Geist, Geist_Mono } from 'next/font/google';

/** Loaded once here so every zone renders the same type. `globals.css` maps
 *  the CSS variables onto Tailwind's `font-sans` and `font-mono`. */
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
