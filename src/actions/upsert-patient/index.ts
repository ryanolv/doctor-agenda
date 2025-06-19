"use server";

import { actionClient } from "@/lib/next-safe-action";
import { upsertPatientSchema } from "./schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { parse, format } from "date-fns";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    const parsedDate = parse(parsedInput.dateOfBirth, "dd/MM/yyyy", new Date());
    const dateOfBirth = format(parsedDate, "yyyy-MM-dd");

    await db
      .insert(patientsTable)
      .values({
        ...parsedInput,
        dateOfBirth,
        clinicId: session.user.clinic?.id,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...parsedInput,
          dateOfBirth,
        },
      });

    revalidatePath("/patients");
  });
