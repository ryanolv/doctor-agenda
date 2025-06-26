import { eq } from "drizzle-orm";
import { BriefcaseMedical, Calendar, DollarSign } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
} from "@/components/ui/page-container";
import {
  getApppointmentsForTomorrow,
  getMonthlyBiling,
  getNumberOfAppointmentsForToday,
  getNumberOfDoctorsInServiceToday,
} from "@/data/get-data";
import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AppointmentTable from "./components/appointments-table";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });

  if (clinics.length === 0) {
    redirect("/create-clinic");
  }

  const appointmentsForTomorrow = await getApppointmentsForTomorrow(
    clinics[0].clinicId,
  );

  const numberOfAppointmentsForToday = await getNumberOfAppointmentsForToday(
    clinics[0].clinicId,
  );

  const monthlyBilling = await getMonthlyBiling(clinics[0].clinicId);
  const doctorsInService = await getNumberOfDoctorsInServiceToday(
    clinics[0].clinicId,
  );

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Bem-vindo ao painel de controle! Aqui você pode gerenciar sua
            clínica, agendamentos e pacientes.
          </p>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-4">
          <Card className="w-fit">
            <CardContent>
              <span className="text-muted-foreground text-sm font-semibold">
                <Calendar className="mr-1 inline" size={18} />
                Consultas para hoje
              </span>
              <p className="text-center text-2xl font-bold">
                {numberOfAppointmentsForToday}
              </p>
            </CardContent>
          </Card>
          <Card className="w-fit">
            <CardContent>
              <span className="text-muted-foreground text-sm font-semibold">
                <DollarSign className="mr-1 inline" size={18} />
                Faturamento do mês
              </span>
              <p className="text-center text-2xl font-bold">
                R$ {monthlyBilling.toFixed(2).replace(".", ",")}
              </p>
            </CardContent>
          </Card>
          <Card className="w-fit">
            <CardContent>
              <span className="text-muted-foreground text-sm font-semibold">
                <BriefcaseMedical className="mr-1 inline" size={18} />
                Médicos em serviço
              </span>
              <p className="text-center text-2xl font-bold">10</p>
            </CardContent>
          </Card>
          <Card className="w-fit">
            <CardContent>
              <span className="text-muted-foreground text-sm font-semibold">
                <Calendar className="mr-1 inline" size={18} />
                Consultas para hoje
              </span>
              <p className="text-center text-2xl font-bold">10</p>
            </CardContent>
          </Card>
        </div>
        <div className="">
          <AppointmentTable appointmentsForTomorrow={appointmentsForTomorrow} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
