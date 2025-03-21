import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { monad } from './chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
const monadRpc = process.env.NEXT_PUBLIC_MONAD_RPC!;

const wagmiConfig = getDefaultConfig({
  appName: 'Velocity Rush',
  projectId,
  chains: [monad],
  transports: {
    [monad.id]: http(monadRpc),
  },
  ssr: true,
});

export default wagmiConfig;
