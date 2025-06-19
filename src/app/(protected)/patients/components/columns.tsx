"use client";

import { ColumnDef } from "@tanstack/react-table";

import UpdatePatientButton from "./update-patient-button";
import { convertDateToLocalTimezone } from "@/helpers/timezone";

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sex: "male" | "female";
  dateOfBirth: string;
};

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "NOME",
  },
  {
    accessorKey: "email",
    header: "E-MAIL",
  },
  {
    accessorKey: "phone",
    header: "NÚMERO DE CELULAR",
  },
  {
    accessorKey: "dateOfBirth",
    header: "NASCIMENTO",
    cell: ({ row }) => {
      return convertDateToLocalTimezone(row.original.dateOfBirth);
    },
  },
  {
    accessorKey: "details",
    header: "DETALHES",
    cell: ({ row }) => {
      return <UpdatePatientButton patient={row.original} />;
    },
  },
];
