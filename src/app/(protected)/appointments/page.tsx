import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageHeader,
  PageHeaderContent,
} from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const AppointmentsPage = () => {
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
          <Button>
            <Plus className="h-4 w-4" />
            Agendar consulta
          </Button>
        </PageActions>
      </PageHeader>
    </PageContainer>
  );
};

export default AppointmentsPage;
