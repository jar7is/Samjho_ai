import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React, { Suspense } from 'react';
import './globals.css';
import { ReliefBridgeProvider } from '@/lib/store';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { Navbar } from '@/components/layout/Navbar';
import { LifeBuoy, ShieldAlert, HeartHandshake } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Samjho AI — Evidence & Conflict Review System',
  description:
    'Decision-support application helping relief coordinators transform fragmented disaster reports into structured, evidence-linked incident cases.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
        <ReliefBridgeProvider>
          <DemoBanner />
          <Suspense fallback={<div className="h-16 border-b border-zinc-800 bg-zinc-950/90" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {children}
          </main>
          <footer className="border-t border-zinc-800 bg-zinc-950/80 py-8 text-xs text-zinc-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-zinc-300">
                  Samjho AI
                </span>
                <span>• PromptWars Societal Benefit Challenge</span>
              </div>
              <div className="text-center sm:text-right text-[11px] text-zinc-500">
                Decision Support Only. Not an automated 911 dispatch system.
                Zero paid APIs required.
              </div>
            </div>
          </footer>
        </ReliefBridgeProvider>
      </body>
    </html>
  );
}
