"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  convertDateToLocalTimezone,
  convertDateToTimeString,
} from "@/helpers/timezone";
import { AppointmentDTO } from "@/types/dto";

type ViewAppointmentProps = {
  appointment: AppointmentDTO;
};

const ViewAppointment = ({ appointment }: ViewAppointmentProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="ghost" size="icon">
          <ExternalLink className="" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Visualizar Consulta</DialogTitle>
          <DialogDescription>
            Visualize os detalhes da consulta agendada.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <Label>Paciente</Label>
          <Input disabled value={appointment.patient.name} />
          <div className="flex items-center gap-5">
            <div>
              <Label>Medico</Label>
              <Input
                disabled
                value={appointment.doctor.name}
                className="truncate"
              />
            </div>
            <div>
              <Label>Valor da Consulta</Label>
              <Input
                disabled
                value={`R$ ${appointment.appointmentPriceInCents / 100}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Data da consulta</Label>
              <Input
                disabled
                value={convertDateToLocalTimezone(
                  appointment.date.toISOString(),
                )}
              />
            </div>
            <div>
              <Label>Horário da Consulta</Label>
              <Input
                disabled
                value={convertDateToTimeString(appointment.date)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="cursor-pointer">
            Cancelar consulta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointment;
