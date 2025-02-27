import {
  type Address,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { monad } from './chains';

const privateKey = process.env.PRIVATE_KEY as Address;

export const publicClient = createPublicClient({
  chain: monad,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: monad,
  transport: http(),
});

export const account = privateKeyToAccount(privateKey);
