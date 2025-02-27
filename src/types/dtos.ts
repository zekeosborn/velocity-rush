import { nameFormSchema, userPatchSchema } from '@/lib/validation-schemas';
import { User } from '@prisma/client';
import type { Address } from 'viem';
import { z } from 'zod';

export type UserPatchDto = z.infer<typeof userPatchSchema>;
export type NameFormDto = z.infer<typeof nameFormSchema>;

export type UserDto = User & {
  walletAddress: Address;
};
