import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import SiteStatus from './_components/SiteStatus';
import Providers from './_components/Providers';

import '@/styles/globals.css';

const isSiteMaintenance = process.env.SITE_MAINTENANCE === 'true';
const isSitePaused = process.env.SITE_PAUSED === 'true';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {isSiteMaintenance || isSitePaused ? (
          <SiteStatus status={isSiteMaintenance ? 'maintenance' : 'pause'} />
        ) : (
          <MainContent>{children}</MainContent>
        )}
      </body>
    </html>
  );
}

async function MainContent({ children }: React.PropsWithChildren) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <Providers cookies={cookies}>
      <main>{children}</main>
      <Toaster />
      <Analytics />
      <SpeedInsights />
    </Providers>
  );
}

export const metadata: Metadata = {
  title: 'Velocity Rush',
};
