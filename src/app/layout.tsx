import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import Providers from './_components/Providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<React.PropsWithChildren>) {
  const headersList = await headers();
  const cookies = headersList.get('cookie');

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers cookies={cookies}>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Velocity Rush',
};
