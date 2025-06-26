import { headers } from "next/headers";

import { DataTable } from "@/components/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
} from "@/components/ui/page-container";
import {
  getAppointment,
  getIdAndNameDoctors,
  getIdAndNamePatients,
} from "@/data/get-data";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./components/add-appointment-button";
import { columns } from "./components/columns";

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!session.user.clinic) {
    throw new Error("Clinic not found");
  }

  const appointments = await getAppointment(session.user.clinic.id);
  const [patients, doctors] = await Promise.all([
    getIdAndNamePatients(session.user.clinic.id),
    getIdAndNameDoctors(session.user.clinic.id),
  ]);
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os agendamentos dos pacientes.
          </p>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={appointments} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
