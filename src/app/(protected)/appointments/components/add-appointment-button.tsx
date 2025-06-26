"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DoctorDTO, PatientDTO } from "@/types/dto";

import AddAppointmentForm from "./add-appointment-form";

type AddAppointmentButtonProps = {
  patients: Pick<PatientDTO, "id" | "name">[];
  doctors: Pick<DoctorDTO, "id" | "name" | "appointmentPriceInCents">[];
};

const AddAppointmentButton = ({
  patients,
  doctors,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          Agendar consulta
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

export default AddAppointmentButton;
