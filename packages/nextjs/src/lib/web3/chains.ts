import { Chain } from 'viem';

const monadRpc = process.env.NEXT_PUBLIC_MONAD_RPC!;

export const monad = {
  id: 10143,
  name: 'Monad',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [monadRpc],
    },
  },
} satisfies Chain;
