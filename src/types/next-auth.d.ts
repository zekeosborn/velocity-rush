import 'next-auth';
import type { Address } from 'viem';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      walletAddress: Address;
      username: string | null;
    };
    expires: ISODateString;
  }
}
