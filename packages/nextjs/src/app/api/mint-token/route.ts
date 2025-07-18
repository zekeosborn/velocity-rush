import authOptions from '@/lib/auth-options';
import { verifyHmac } from '@/lib/web3/hmac';
import tokenAbi from '@/lib/web3/token-abi';
import { account, publicClient, walletClient } from '@/lib/web3/viem-config';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress, parseUnits, type Address } from 'viem';

const tokenAddress = process.env.TOKEN_ADDRESS as Address;
const mintAmount = parseUnits('1', 18);

export async function POST(request: NextRequest) {
  try {
    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // HMAC authentication
    const body = await request.json();
    const timestamp = parseInt(request.headers.get('timestamp') ?? '0', 10);
    const signature = request.headers.get('signature') ?? '';

    const isHmacValid = verifyHmac(JSON.stringify(body), timestamp, signature);

    if (!isHmacValid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Recipient validation
    const { recipient } = body;

    if (!isAddress(recipient)) {
      return NextResponse.json('Invalid recipient address', { status: 400 });
    }

    // Mint token
    const { request: mintRequest } = await publicClient.simulateContract({
      address: tokenAddress,
      abi: tokenAbi,
      functionName: 'mint',
      args: [recipient, mintAmount],
      account,
    });

    const hash = await walletClient.writeContract(mintRequest);

    return NextResponse.json({ hash });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to mint token' },
      { status: 500 },
    );
  }
}
