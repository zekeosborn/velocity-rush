import authOptions from '@/lib/auth-options';
import tokenAbi from '@/lib/web3/token-abi';
import { account, publicClient, walletClient } from '@/lib/web3/viem-config';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress, parseUnits, type Address } from 'viem';

const hmacSecret = process.env.HMAC_SECRET!;
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS as Address;
const amount = parseUnits('1', 18);
const maxTimeDiff = 30; // 30 seconds

export async function POST(req: NextRequest) {
  try {
    const { recipient } = await req.json();

    // Authorization
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // HMAC Authentication
    const timestamp = parseInt(req.headers.get('timestamp') ?? '0', 10);
    const dateNow = Date.now() / 1000;

    const receivedSignature = req.headers.get('signature');
    const expectedSignature = generateHmac(
      JSON.stringify({ recipient }),
      timestamp.toString(),
    );

    const isInvalidTimestamp = Math.abs(dateNow - timestamp) > maxTimeDiff;
    const isInvalidSignature = receivedSignature !== expectedSignature;

    if (isInvalidTimestamp || isInvalidSignature) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Recipient validation
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

function generateHmac(data: string, timestamp: string) {
  const hmac = crypto.createHmac('sha256', hmacSecret);
  hmac.update(data);
  hmac.update(timestamp);
  return hmac.digest('hex');
}
