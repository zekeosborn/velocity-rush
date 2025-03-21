import type { Address } from 'viem';

declare module 'next-auth' {
  interface User {
    id: string;
    walletAddress: Address;
    username: string | null;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    walletAddress: Address;
    username: string | null;
  }
}
