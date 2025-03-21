import authOptions from '@/lib/auth-options';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  requestContext: RequestContext,
) {
  try {
    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get leaderboard
    const { id } = await requestContext.params;

    const leaderboard = await prisma.$queryRaw`
      WITH RankedUser AS (
        SELECT 
          id,
          CAST(ROW_NUMBER() OVER (ORDER BY "longestRun" DESC) AS INT) AS rank,
          "walletAddress", 
          username, 
          "longestRun"
        FROM "User"
        WHERE username IS NOT NULL AND "longestRun" > 0
      )
      SELECT rank, "walletAddress", username, "longestRun"
      FROM RankedUser 
      WHERE rank <= 100 OR id = ${id}
    `;

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to retrieve leaderboard' },
      { status: 500 },
    );
  }
}

interface RequestContext {
  params: Promise<{ id: string }>;
}
