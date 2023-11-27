import { z } from "zod";

export const swapInputSchema = z.object({
  id: z.number(),
  fromIndex: z.number(),
  toIndex: z.number(),
});
