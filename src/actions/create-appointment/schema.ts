import z from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  appointmentPrice: z.number(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
});

export type AppointmentSchema = z.infer<typeof appointmentSchema>;
