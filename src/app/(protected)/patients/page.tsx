import Link from "next/link";
import { listPatients } from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import dayjs from "dayjs";

export default async function PatientsListPage() {
  const response = await listPatients({ activeOnly: undefined });

  if (response.status !== 200) {
    return (
      <div className="p-5">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Pacientes
        </h1>
        <p className="mt-2 font-heading text-sm text-destructive">
          Não foi possível carregar os pacientes. Tente novamente.
        </p>
      </div>
    );
  }

  const patients = response.data.patients;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Pacientes
        </h1>
        <Button asChild>
          <Link href="/patients/new" className="gap-2">
            <UserPlus className="size-4" />
            Novo paciente
          </Link>
        </Button>
      </div>

      {patients.length === 0 ? (
        <p className="mt-6 font-heading text-sm text-muted-foreground">
          Nenhum paciente cadastrado. Clique em &quot;Novo paciente&quot; para
          começar.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {patients.map((patient) => (
            <li key={patient.id}>
              <Link href={`/patients/${patient.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="font-heading text-base">
                      {patient.name}
                    </CardTitle>
                    <Badge
                      variant={patient.isActive ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {patient.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </CardHeader>
                  {(patient.notes || patient.createdAt) && (
                    <CardContent className="pt-0">
                      {patient.notes && (
                        <CardDescription className="line-clamp-2">
                          {patient.notes}
                        </CardDescription>
                      )}
                      <p className="mt-1 font-heading text-xs text-muted-foreground">
                        Cadastrado em{" "}
                        {dayjs(patient.createdAt).format("DD/MM/YYYY")}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
