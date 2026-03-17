import Link from "next/link";
import { notFound } from "next/navigation";
import { getStructuredAssessment } from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import dayjs from "dayjs";
import { EditAssessmentForm } from "../_components/edit-assessment-form";

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assessmentId: string }>;
}) {
  const { id: patientId, assessmentId } = await params;
  const response = await getStructuredAssessment(patientId, assessmentId);

  if (response.status === 404) notFound();
  if (response.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar a avaliação.
        </p>
      </div>
    );
  }

  const assessment = response.data;
  const payloadStr =
    typeof assessment.payload === "object" && assessment.payload !== null
      ? JSON.stringify(assessment.payload, null, 2)
      : String(assessment.payload ?? "{}");

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`} aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          {assessment.protocolName ?? "Avaliação"}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-base">Dados</CardTitle>
          <CardDescription>
            Data da avaliação:{" "}
            {dayjs(assessment.assessedAt).format("DD/MM/YYYY [às] HH:mm")}.
            Criado em {dayjs(assessment.createdAt).format("DD/MM/YYYY")};
            atualizado em {dayjs(assessment.updatedAt).format("DD/MM/YYYY")}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-xs text-muted-foreground uppercase">
            Payload
          </p>
          <pre className="mt-1 overflow-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-sm">
            {payloadStr}
          </pre>
        </CardContent>
      </Card>

      <EditAssessmentForm
        patientId={patientId}
        assessmentId={assessment.id}
        initialAssessedAt={assessment.assessedAt.slice(0, 16)}
        initialPayloadJson={payloadStr}
      />
    </div>
  );
}
