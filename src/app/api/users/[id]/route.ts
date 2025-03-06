import authOptions from '@/lib/auth-options';
import { userPatchSchema } from '@/lib/validation-schemas';
import tokenAbi from '@/lib/web3/token-abi';
import { publicClient } from '@/lib/web3/viem-config';
import prisma from '@/prisma/client';
import type { UserPatchDto } from '@/types/dtos';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { formatUnits, type Address } from 'viem';

const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS as Address;

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

    // User validation
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get RUSH balance
    const rush = await publicClient.readContract({
      address: tokenContractAddress,
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

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Form data validation
    const body: UserPatchDto = await request.json();
    const validation = userPatchSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const { username, longestRun } = body;

    // User validation
    const users = await prisma.user.findMany();
    const userIndex = users.findIndex((user) => user.id === id);
    const user = userIndex !== -1 ? users.splice(userIndex, 1)[0] : undefined;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (users.some((user) => user.username === username)) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 },
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username, longestRun },
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
