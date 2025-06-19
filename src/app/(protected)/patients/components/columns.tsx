"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  sex: "male" | "female";
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
    accessorKey: "sex",
    header: "SEXO",
  },
];
