'use client';

import wagmiConfig from '@/lib/web3/wagmi-config';
import { lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

interface Props {
  children: React.ReactNode;
  cookies: string | null;
}

const queryClient = new QueryClient();

export default function Providers({ children, cookies }: Props) {
  const initialState = cookieToInitialState(wagmiConfig, cookies);

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider
              modalSize="compact"
              theme={lightTheme({
                accentColor: '#7c3aed',
                overlayBlur: 'small',
                borderRadius: 'small',
              })}
            >
              {children}
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}
