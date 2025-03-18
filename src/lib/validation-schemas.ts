import { z } from 'zod';

const usernameSchema = z
  .string()
  .trim()
  .nonempty('Please enter a username.')
  .min(3, 'Must be at least 3 characters long.')
  .regex(
    /^[a-zA-Z0-9._]*$/,
    'Only letters, numbers, dots, and underscores are allowed.',
  )
  .max(11, 'Must be no more than 11 characters long.');

export const userPatchSchema = z.object({
  username: usernameSchema.optional(),
  longestRun: z.number().optional(),
});

export const usernameFormSchema = z.object({
  username: usernameSchema,
});
