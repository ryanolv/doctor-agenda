"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4" />
          Adicionar paciente
        </Button>
      </DialogTrigger>
      <UpsertPatientForm
        onSuccess={() => setIsOpen(false)}
        dialogIsOpen={isOpen}
      />
    </Dialog>
  );
};

export default AddPatientButton;
