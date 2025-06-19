import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { AppointmentDTO, DoctorDTO, PatientDTO } from "@/types/dto";
import { eq } from "drizzle-orm";

export const getDoctors = async (clinicId: string): Promise<DoctorDTO[]> => {
  return await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
  });
};

export const getAppointment = async (
  clinicId: string,
): Promise<AppointmentDTO[]> => {
  return await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, clinicId),
  });
};

export const getPatients = async (clinicId: string): Promise<PatientDTO[]> => {
  return await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
  });
};
