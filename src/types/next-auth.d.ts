import 'next-auth';
import type { Address } from 'viem';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      walletAddress: Address;
      name: string | null;
    };
    expires: ISODateString;
  }
}
