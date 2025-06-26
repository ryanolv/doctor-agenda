"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { convertDateToLocalTimezone } from "@/helpers/timezone";
import { PatientDTO } from "@/types/dto";

import UpsertPatientForm from "./upsert-patient-form";

type UpdatePatientButtonProps = {
  patient: Omit<PatientDTO, "clinicId" | "createdAt" | "updatedAt">;
};

const UpdatePatientButton = ({ patient }: UpdatePatientButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <ExternalLink className="text-muted-foreground h-4 w-4" />
        </Button>
      </DialogTrigger>
      <UpsertPatientForm
        onSuccess={() => setIsOpen(false)}
        defaultValues={{
          ...patient,
          dateOfBirth: convertDateToLocalTimezone(patient.dateOfBirth),
        }}
        isUpdate={true}
        dialogIsOpen={isOpen}
      />
    </Dialog>
  );
};

export default UpdatePatientButton;
