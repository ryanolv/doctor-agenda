import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPatients } from "@/data/get-patients";
import { auth } from "@/lib/auth";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
} from "@/components/ui/page-container";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import AddPatientButton from "./components/add-patient-button";

const PatientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/create-clinic");
  }

  const patients = await getPatients(session.user.clinic.id);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground text-sm">
            Acesse uma visão detalhada das métricas chaves e resultados do
            paciente
          </p>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={patients} />
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
