import { z } from "zod";
import { schema } from "./schema";

export type FormValues = z.infer<typeof schema>;
