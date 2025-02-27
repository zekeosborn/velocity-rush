import velocityTokenAbi from '@/contracts/velocityTokenAbi';
import authOptions from '@/lib/auth-options';
import { userPatchSchema } from '@/lib/validation-schemas';
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

    // Get VELO balance
    const velo = await publicClient.readContract({
      address: tokenContractAddress,
      abi: velocityTokenAbi,
      functionName: 'balanceOf',
      args: [user.walletAddress as Address],
    });

    const userData = {
      ...user,
      velo: formatBalance(velo),
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

    const { name, longestRun } = body;

    // User validation
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, longestRun },
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
