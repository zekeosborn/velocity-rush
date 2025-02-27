import { z } from 'zod';

export const userPatchSchema = z.object({
  name: z.string().trim().min(3).max(21).optional(),
  longestRun: z.number().optional(),
});

export const nameFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('Please enter your name.')
    .min(3, 'Must be at least 3 characters long.')
    .max(21, 'Must be no more than 21 characters long.'),
});
