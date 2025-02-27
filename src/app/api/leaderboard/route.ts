import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { longestRun: { gt: 0 } },
      orderBy: { longestRun: 'desc' },
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      name: user.name,
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
