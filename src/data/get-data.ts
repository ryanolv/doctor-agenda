import { and, desc, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { AppointmentDTO, DoctorDTO, PatientDTO } from "@/types/dto";

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
    with: {
      patient: {
        columns: {
          id: true,
          name: true,
        },
      },
      doctor: {
        columns: {
          id: true,
          name: true,
          specialization: true,
        },
      },
    },
    orderBy: [desc(appointmentsTable.createdAt)],
  });
};

export const getPatients = async (clinicId: string): Promise<PatientDTO[]> => {
  return await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
  });
};

export const getIdAndNamePatients = async (clinicId: string) => {
  return await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, clinicId),
    columns: {
      id: true,
      name: true,
    },
  });
};

export const getIdAndNameDoctors = async (clinicId: string) => {
  return await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, clinicId),
    columns: {
      id: true,
      name: true,
      appointmentPriceInCents: true,
    },
  });
};

export const getApppointmentsForTomorrow = async (clinicId: string) => {
  const startNextDay = new Date();
  startNextDay.setDate(startNextDay.getDate() + 1);
  startNextDay.setHours(0, 0, 0, 0);

  const finishNextDay = new Date(startNextDay);
  finishNextDay.setHours(23, 59, 59, 999);

  return await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, clinicId),
      gte(appointmentsTable.date, startNextDay),
      lte(appointmentsTable.date, finishNextDay),
      eq(appointmentsTable.status, "scheduled"),
    ),
    with: {
      patient: {
        columns: {
          id: true,
          name: true,
          phone: true,
        },
      },
      doctor: {
        columns: {
          id: true,
          name: true,
          specialization: true,
        },
      },
    },
    orderBy: [desc(appointmentsTable.createdAt)],
  });
};

export const getNumberOfAppointmentsForToday = async (clinicId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, clinicId),
      gte(appointmentsTable.date, today),
      lte(appointmentsTable.date, tomorrow),
    ),
  });

  return appointments.length;
};

export const getMonthlyBiling = async (clinicId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setHours(23, 59, 59, 999);

  const appointments = await db.query.appointmentsTable.findMany({
    where: and(
      eq(appointmentsTable.clinicId, clinicId),
      gte(appointmentsTable.date, startOfMonth),
      lte(appointmentsTable.date, endOfMonth),
      eq(appointmentsTable.status, "completed"),
    ),
    columns: {
      appointmentPriceInCents: true,
    },
  });

  return appointments.reduce((total, appointment) => {
    return total + (appointment.appointmentPriceInCents / 100 || 0);
  }, 0);
};
