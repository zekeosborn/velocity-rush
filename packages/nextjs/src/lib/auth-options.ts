import prisma from '@/prisma/client';
import type { UserDto } from '@/types/dtos';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Monad',
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

          const user = await getCreateUser(siwe.address);

          return {
            id: user.id,
            walletAddress: user.walletAddress,
            username: user.username,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
        token.username = user.username;
      }

      if (trigger === 'update' && session?.username) {
        token.username = session.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          id: token.id,
          walletAddress: token.walletAddress,
          username: token.username,
        };
      }

      return session;
    },
  },
};

async function getCreateUser(walletAddress: string) {
  return prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: { walletAddress },
  }) as Promise<UserDto>;
}

export default authOptions;
