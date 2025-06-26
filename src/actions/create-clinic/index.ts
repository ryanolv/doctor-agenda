"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (
  name: string,
  address: string,
  phone: string,
  email: string,
  website?: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name,
      address,
      phone,
      email,
      website,
    })
    .returning();

  await db.insert(usersToClinicsTable).values({
    userId: user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};
