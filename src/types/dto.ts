export type DoctorDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  availableWeekdays: number[];
  availableFromTime: string;
  availableToTime: string;
  appointmentPriceInCents: number;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PatientDTO = {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  phone: string;
  sex: "male" | "female";
  dateOfBirth: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentDTO = {
  id: string;
  patient: {
    id: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
    specialization: string;
  };
  clinicId: string;
  date: Date;
  status: "scheduled" | "completed" | "cancelled";
  appointmentPriceInCents: number;
  createdAt: Date;
  updatedAt: Date;
};
