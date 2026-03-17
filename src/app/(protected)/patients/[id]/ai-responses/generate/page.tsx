import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPatient,
  listStructuredAssessments,
  listUnstructuredObservations,
} from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { GenerateAiAnalysisForm } from "../_components/generate-ai-analysis-form";

export default async function GenerateAiAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = await params;
  const [patientResponse, assessmentsResponse, observationsResponse] =
    await Promise.all([
      getPatient(patientId),
      listStructuredAssessments(patientId),
      listUnstructuredObservations(patientId),
    ]);

  if (patientResponse.status === 404) notFound();
  if (patientResponse.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar o paciente.
        </p>
      </div>
    );
  }

  const patient = patientResponse.data;
  const assessments =
    assessmentsResponse.status === 200
      ? assessmentsResponse.data.assessments
      : [];
  const observations =
    observationsResponse.status === 200
      ? observationsResponse.data.observations
      : [];

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`} aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Gerar análise com IA — {patient.name}
        </h1>
      </div>

      <GenerateAiAnalysisForm
        patientId={patientId}
        assessments={assessments.map((a) => ({
          id: a.id,
          label: `${a.protocolName ?? "Protocolo"} (${new Date(a.assessedAt).toLocaleDateString("pt-BR")})`,
        }))}
        observations={observations.map((o) => ({
          id: o.id,
          label: `${o.content.slice(0, 40)}${o.content.length > 40 ? "…" : ""} (${new Date(o.observedAt).toLocaleDateString("pt-BR")})`,
        }))}
      />
    </div>
  );
}
