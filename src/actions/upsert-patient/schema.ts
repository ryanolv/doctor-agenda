import z from "zod";

import { dateIsNotInFuture, isValidDate } from "@/helpers/validation";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.string().min(10).refine(isValidDate).refine(dateIsNotInFuture),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
