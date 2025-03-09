import authOptions from '@/lib/auth-options';
import tokenAbi from '@/lib/web3/token-abi';
import { account, publicClient, walletClient } from '@/lib/web3/viem-config';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress, parseUnits, type Address } from 'viem';

const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS as Address;
const amount = parseUnits('1', 18);

export async function POST(req: NextRequest) {
  try {
    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Recipient validation
    const { recipient } = await req.json();

    if (!isAddress(recipient)) {
      return NextResponse.json('Invalid recipient address', { status: 400 });
    }

    // Transfer token
    const { request } = await publicClient.simulateContract({
      address: tokenContractAddress,
      abi: tokenAbi,
      functionName: 'transfer',
      args: [recipient, amount],
      account,
    });

    const hash = await walletClient.writeContract(request);

    return NextResponse.json({ hash });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to transfer token' },
      { status: 500 },
    );
  }
}
