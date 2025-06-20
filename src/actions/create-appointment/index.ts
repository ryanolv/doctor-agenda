"use server";

import { actionClient } from "@/lib/next-safe-action";
import { appointmentSchema } from "./schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import {
  convertDateTimeToUtcTimezone,
  convertTimeToUtcTimezone,
} from "@/helpers/timezone";

export const createAppointment = actionClient
  .schema(appointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session.user.clinic) {
      throw new Error("Clinic not found");
    }

    const {
      patientId,
      doctorId,
      appointmentPrice,
      appointmentDate,
      appointmentTime,
    } = parsedInput;

    const appointmentDateUTC = appointmentDate.toISOString().split("T")[0];
    const appointmentTimeUTC = convertTimeToUtcTimezone(appointmentTime);

    const dateUTC = convertDateTimeToUtcTimezone(
      appointmentDateUTC,
      appointmentTimeUTC,
    );

    await db.insert(appointmentsTable).values({
      patientId,
      doctorId,
      clinicId: session.user.clinic.id,
      appointmentPriceInCents: appointmentPrice * 100,
      status: "scheduled",
      date: dateUTC,
    });

    revalidatePath("/appointments");
  });
