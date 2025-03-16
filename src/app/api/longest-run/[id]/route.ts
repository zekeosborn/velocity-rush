import authOptions from '@/lib/auth-options';
import { userPatchSchema } from '@/lib/validation-schemas';
import { verifyHmac } from '@/lib/web3/hmac';
import prisma from '@/prisma/client';
import type { UserPatchDto } from '@/types/dtos';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

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

    // HMAC authentication
    const body: UserPatchDto = await request.json();
    const timestamp = parseInt(request.headers.get('timestamp') ?? '0', 10);
    const signature = request.headers.get('signature') ?? '';

    const isHmacValid = verifyHmac(JSON.stringify(body), timestamp, signature);

    if (!isHmacValid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Form data validation
    const validation = userPatchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    const { longestRun } = body;

    // Check if user exist
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { longestRun },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to update longest run' },
      { status: 500 },
    );
  }
}

interface RequestContext {
  params: Promise<{ id: string }>;
}
