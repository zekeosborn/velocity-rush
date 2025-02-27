import prisma from '@/prisma/client';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import type { Address } from 'viem';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          placeholder: '0x0',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          placeholder: '0x0',
          type: 'text',
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) return null;

          const siwe = new SiweMessage(credentials.message);

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);

          if (!nextAuthUrl) return null;

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) return null;

          const csrfToken = await getCsrfToken({
            req: { headers: req.headers },
          });

          if (siwe.nonce !== csrfToken) return null;

          await siwe.verify({ signature: credentials.signature });
          return { id: siwe.address };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await getCreateUser(user.id);
        return true;
      } catch {
        return false;
      }
    },
    async session({ session, token }) {
      if (!token.sub) throw new Error('Token does not have a subject.');

      const user = await getCreateUser(token.sub);

      session.user = {
        id: user.id,
        walletAddress: user.walletAddress as Address,
        name: user.name,
      };

      return session;
    },
  },
};

async function getCreateUser(walletAddress: string) {
  let user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { walletAddress },
    });
  }

  return user;
}

export default authOptions;
