import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display, IBM_Plex_Mono } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-dm-serif' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });

export const metadata: Metadata = {
  title: 'ModelMatch - AI Model Recommender',
  description: 'Find the most suitable AI model for your questions.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable} ${plexMono.variable}`}>
      <body>
        <div className="model-match-shell relative isolate overflow-hidden">
          <div className="shell-grain" aria-hidden="true" />
          <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-6 sm:px-10 lg:px-[7.2vw]">
            <header className="flex min-h-[82px] flex-wrap items-center justify-between gap-3 border-b border-[#d9d2c2] py-3">
              <a href="/" className="flex items-center gap-3" aria-label="ModelMatch home">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#244944] text-[#f4f0e5]">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
                    <path d="M3.25 13.75V5.25h2.1l4.15 5.1 4.15-5.1h2.1v8.5h-2.1V8.55L9.5 13.2 5.35 8.55v5.2h-2.1Z" fill="currentColor" />
                    <circle cx="15.7" cy="3.3" r="1.3" fill="#e6a75b" />
                  </svg>
                </span>
                <span className="text-[17px] font-semibold tracking-[-0.04em]">modelmatch</span>
              </a>
              <nav className="flex items-center gap-5 text-[13px] font-medium text-[#54645d]">
                <a href="/" className="hover:text-[#203c39]">Home</a>
                <a href="/history" className="hover:text-[#203c39]">History</a>
                <a href="/settings" className="hover:text-[#203c39]">Settings</a>
                <a href="/login" className="rounded-lg border border-[#244944] px-3 py-1.5 text-[#244944] hover:bg-[#244944] hover:text-[#f4f0e5]">Sign In</a>
              </nav>
            </header>
            <main className="flex-1 py-10 sm:py-14">{children}</main>
            <footer className="flex min-h-[66px] flex-wrap items-center justify-between gap-4 border-t border-[#d9d2c2] py-3 text-[11px] text-[#778078]">
              <span>ModelMatch <span className="mx-1 text-[#c4b9a4]">/</span> choosing with intention</span>
              <span>Privacy notice: do not enter personal or customer data.</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
