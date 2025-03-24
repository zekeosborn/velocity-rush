import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat } from 'viem/chains';
import { monad } from './chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL!;

const wagmiConfig = getDefaultConfig({
  appName: 'Velocity Rush',
  projectId,
  chains: [monadRpcUrl ? monad : hardhat],
  ssr: true,
});

export default wagmiConfig;
