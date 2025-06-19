import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { PatientDTO } from "@/types/dto";
import { eq } from "drizzle-orm";

export const getPatients = async (clinicId: string): Promise<PatientDTO[]> => {
  return await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
  });
};
