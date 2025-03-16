import authOptions from '@/lib/auth-options';
import { userPatchSchema } from '@/lib/validation-schemas';
import tokenAbi from '@/lib/web3/token-abi';
import { publicClient } from '@/lib/web3/viem-config';
import prisma from '@/prisma/client';
import type { UserPatchDto } from '@/types/dtos';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { formatUnits, type Address } from 'viem';

const tokenCA = process.env.TOKEN_CA as Address;

export async function GET(
  request: NextRequest,
  requestContext: RequestContext,
) {
  try {
    const { id } = await requestContext.params;

    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exist
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get RUSH balance
    const rush = await publicClient.readContract({
      address: tokenCA,
      abi: tokenAbi,
      functionName: 'balanceOf',
      args: [user.walletAddress as Address],
    });

    const userData = {
      ...user,
      rush: formatBalance(rush),
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to retrieve user' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  requestContext: RequestContext,
) {
  try {
    const { id } = await requestContext.params;

    // Authorization
    const session = await getServerSession(authOptions);

    if (!session || id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Form data validation
    const body: UserPatchDto = await request.json();
    const validation = userPatchSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const { username } = body;

    // Check if user exist
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if username is taken
    const isUsernameTaken = await prisma.user.count({
      where: { username: username ?? '', NOT: { id } },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 },
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    );
  }
}

interface RequestContext {
  params: Promise<{ id: string }>;
}

function formatBalance(balance: bigint) {
  return parseFloat(formatUnits(balance, 18)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
}
