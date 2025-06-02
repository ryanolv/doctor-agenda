import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2, {
      message: "Nome é obrigatório.",
    }),
    email: z.string().email(),
    phone: z.string().min(8),
    avatarImageUrl: z.string().optional(),
    specialization: z.string(),
    appointmentPriceInCents: z.number().min(1),
    availableWeekDays: z.array(z.number().min(0).max(6)),
    availableFromTime: z.string(),
    availableToTime: z.string(),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Escolha outro horário",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
