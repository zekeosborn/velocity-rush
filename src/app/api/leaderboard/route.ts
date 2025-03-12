import authOptions from '@/lib/auth-options';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data
    const users = await prisma.user.findMany({
      where: { banned: false, longestRun: { gt: 0 } },
      orderBy: { longestRun: 'desc' },
    });

    // Restructure user data
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      username: user.username,
      longestRun: user.longestRun,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to retrieve leaderboard' },
      { status: 500 },
    );
  }
}
