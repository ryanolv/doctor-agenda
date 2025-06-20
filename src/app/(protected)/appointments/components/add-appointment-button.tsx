"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddAppointmentForm from "./add-appointment-form";
import { DoctorDTO, PatientDTO } from "@/types/dto";
import { useState } from "react";

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
