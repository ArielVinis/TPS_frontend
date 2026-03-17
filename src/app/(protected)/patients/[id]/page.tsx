import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPatient,
  listStructuredAssessments,
  listUnstructuredObservations,
  listAiResponses,
} from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ClipboardList, Eye, Plus, Sparkles } from "lucide-react";
import dayjs from "dayjs";
import { EditPatientForm } from "@/app/(protected)/patients/_components/edit-patient-form";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [patientResponse, assessmentsResponse, observationsResponse, aiResponsesResponse] =
    await Promise.all([
      getPatient(id),
      listStructuredAssessments(id),
      listUnstructuredObservations(id),
      listAiResponses(id),
    ]);
  const response = patientResponse;

  if (response.status === 404) notFound();
  if (response.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar o paciente.
        </p>
      </div>
    );
  }

  const patient = response.data;
  const assessments =
    assessmentsResponse.status === 200 ? assessmentsResponse.data.assessments : [];
  const observations =
    observationsResponse.status === 200
      ? observationsResponse.data.observations
      : [];
  const aiResponses =
    aiResponsesResponse.status === 200
      ? aiResponsesResponse.data.aiResponses
      : [];

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients" aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          {patient.name}
        </h1>
        <Badge
          variant={patient.isActive ? "default" : "secondary"}
          className="shrink-0"
        >
          {patient.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-base">Dados</CardTitle>
          <CardDescription>
            Cadastrado em{" "}
            {dayjs(patient.createdAt).format("DD/MM/YYYY [às] HH:mm")}. Última
            atualização em{" "}
            {dayjs(patient.updatedAt).format("DD/MM/YYYY [às] HH:mm")}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {patient.notes && (
            <p className="font-heading text-sm text-muted-foreground">
              {patient.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <EditPatientForm
        patientId={patient.id}
        initialName={patient.name}
        initialNotes={patient.notes ?? ""}
        initialIsActive={patient.isActive}
      />

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Avaliações estruturadas
          </h2>
          <Button asChild size="sm">
            <Link href={`/patients/${id}/assessments/new`} className="gap-2">
              <Plus className="size-4" />
              Nova avaliação
            </Link>
          </Button>
        </div>
        {assessments.length === 0 ? (
          <p className="font-heading text-sm text-muted-foreground">
            Nenhuma avaliação registrada.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {assessments.map((a) => (
              <li key={a.id}>
                <Link href={`/patients/${id}/assessments/${a.id}`}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="size-4 text-muted-foreground" />
                        <CardTitle className="font-heading text-sm">
                          {a.protocolName ?? "Protocolo"}
                        </CardTitle>
                      </div>
                      <CardDescription className="font-heading text-xs">
                        {dayjs(a.assessedAt).format("DD/MM/YYYY [às] HH:mm")}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Observações não estruturadas
          </h2>
          <Button asChild size="sm">
            <Link href={`/patients/${id}/observations/new`} className="gap-2">
              <Plus className="size-4" />
              Nova observação
            </Link>
          </Button>
        </div>
        {observations.length === 0 ? (
          <p className="font-heading text-sm text-muted-foreground">
            Nenhuma observação registrada.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {observations.map((obs) => (
              <li key={obs.id}>
                <Link href={`/patients/${id}/observations/${obs.id}`}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Eye className="size-4 shrink-0 text-muted-foreground" />
                        <CardTitle className="font-heading text-sm truncate">
                          {obs.content.slice(0, 60)}
                          {obs.content.length > 60 ? "…" : ""}
                        </CardTitle>
                      </div>
                      <CardDescription className="font-heading text-xs shrink-0 ml-2">
                        {dayjs(obs.observedAt).format("DD/MM/YYYY [às] HH:mm")}
                      </CardDescription>
                    </CardHeader>
                    {obs.tags && (
                      <CardContent className="pt-0 pb-3">
                        <p className="font-heading text-xs text-muted-foreground">
                          {obs.tags}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Análise com IA
          </h2>
          <Button asChild size="sm">
            <Link
              href={`/patients/${id}/ai-responses/generate`}
              className="gap-2"
            >
              <Sparkles className="size-4" />
              Gerar análise com IA
            </Link>
          </Button>
        </div>
        {aiResponses.length === 0 ? (
          <p className="font-heading text-sm text-muted-foreground">
            Nenhuma análise gerada ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {aiResponses.map((ar) => (
              <li key={ar.id}>
                <Link href={`/patients/${id}/ai-responses/${ar.id}`}>
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-muted-foreground" />
                        <CardTitle className="font-heading text-sm">
                          Análise —{" "}
                          {dayjs(ar.createdAt).format("DD/MM/YYYY [às] HH:mm")}
                        </CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
