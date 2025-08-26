// schema.ts
import { z } from "zod";

export const schema = z.object({
  telephone: z.string().min(11).max(11),
});
