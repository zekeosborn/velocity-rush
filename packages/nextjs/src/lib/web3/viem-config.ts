import {
  type Address,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { monad } from './chains';

const privateKey = process.env.PRIVATE_KEY as Address;
const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL!;

export const publicClient = createPublicClient({
  chain: monadRpcUrl ? monad : hardhat,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: monadRpcUrl ? monad : hardhat,
  transport: http(),
});

export const account = privateKeyToAccount(privateKey);
