import { z } from "zod";

export type SwapInputSchema = z.infer<typeof swapInputSchema>;
export const swapInputSchema = z
  .object({
    fromId: z.number().nonnegative(),
    toId: z.number().nonnegative(),
  })
  .refine((input) => input.fromId !== input.toId, "Ids must be different");
