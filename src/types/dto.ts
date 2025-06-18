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
