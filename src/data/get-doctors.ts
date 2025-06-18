import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { DoctorDTO } from "@/types/dto";
import { eq } from "drizzle-orm";

export const getDoctors = async (clinicId: string): Promise<DoctorDTO[]> => {
  return await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
  });
};
