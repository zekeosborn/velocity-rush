import { usernameFormSchema, userPatchSchema } from '@/lib/validation-schemas';
import { User } from '@prisma/client';
import type { Address } from 'viem';
import { z } from 'zod';

export type UserPatchDto = z.infer<typeof userPatchSchema>;
export type UsernameFormDto = z.infer<typeof usernameFormSchema>;

export type UserDto = User & {
  walletAddress: Address;
};
