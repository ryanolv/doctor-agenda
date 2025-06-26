"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { convertDateToLocalTimezone } from "@/helpers/timezone";
import { AppointmentDTO } from "@/types/dto";

export const APPOINTMENT_STATUS = {
  scheduled: "Agendada",
  completed: "Finalizada",
  cancelled: "Cancelada",
};

export const columns: ColumnDef<AppointmentDTO>[] = [
  {
    accessorKey: "patient.name",
    header: "PACIENTE",
  },
  {
    accessorKey: "date",
    header: "DATA",
    cell: ({ row }) => {
      return convertDateToLocalTimezone(row.original.date.toString());
    },
  },
  {
    accessorKey: "doctor.name",
    header: "MÉDICO",
  },
  {
    accessorKey: "doctor.specialization",
    header: "ESPECIALIDADE",
  },
  {
    accessorKey: "appointmentPriceInCents",
    header: "VALOR",
    cell: ({ row }) => {
      const priceInCents = row.original.appointmentPriceInCents;
      return (
        <span>
          R${" "}
          {Number(priceInCents / 100)
            .toFixed(2)
            .replace(".", ",")}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className="capitalize" variant={status}>
          {APPOINTMENT_STATUS[status]}
        </Badge>
      );
    },
  },
];
