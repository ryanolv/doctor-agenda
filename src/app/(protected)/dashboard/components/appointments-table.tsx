"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertDateToTimeString } from "@/helpers/timezone";
import { AppointmentDTO } from "@/types/dto";

import ViewAppointment from "../../appointments/components/view-appointment";

type AppointmentsTableProps = {
  appointmentsForTomorrow: AppointmentDTO[];
};

const AppointmentTable = ({
  appointmentsForTomorrow,
}: AppointmentsTableProps) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableCaption>
            Pacientes para ligar confirmando consulta.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointmentsForTomorrow.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patient.name}</TableCell>
                <TableCell>
                  {convertDateToTimeString(appointment.date)}
                </TableCell>
                <TableCell>{appointment.patient.phone}</TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{appointment.doctor.specialization}</TableCell>
                <TableCell>
                  <ViewAppointment appointment={appointment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AppointmentTable;
