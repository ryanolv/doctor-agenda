"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { convertTimeToTimezone } from "@/helpers/timezone";
import { DoctorDTO } from "@/types/dto";

import type { UpsertDoctorSchema } from "./upsert-doctor-form";
import UpsertDoctorForm from "./upsert-doctor-form";

type UpdateDoctorButtonProps = {
  doctor: DoctorDTO;
};

const UpdateDoctorButton = ({ doctor }: UpdateDoctorButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultValues: UpsertDoctorSchema = {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization,
    appointmentPrice: doctor.appointmentPriceInCents / 100,
    availableWeekDays: doctor.availableWeekdays,
    availableFromTime: convertTimeToTimezone(doctor.availableFromTime),
    availableToTime: convertTimeToTimezone(doctor.availableToTime),
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer">Ver Detalhes</Button>
      </DialogTrigger>
      <UpsertDoctorForm
        isUpdate={true}
        defaultValues={defaultValues}
        onSuccess={() => setIsOpen(false)}
        dialogIsOpen={isOpen}
      />
    </Dialog>
  );
};

export default UpdateDoctorButton;
