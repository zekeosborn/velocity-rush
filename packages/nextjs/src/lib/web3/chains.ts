import { defineChain } from 'viem';

const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL!;

export const monad = defineChain({
  id: 10_143,
  name: 'Monad',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [monadRpcUrl] },
  },
});
