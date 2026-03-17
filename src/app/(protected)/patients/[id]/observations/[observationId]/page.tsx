import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnstructuredObservation } from "@/app/_lib/api/fetch-generated";
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
import { EditObservationForm } from "../_components/edit-observation-form";

export default async function ObservationDetailPage({
  params,
}: {
  params: Promise<{ id: string; observationId: string }>;
}) {
  const { id: patientId, observationId } = await params;
  const response = await getUnstructuredObservation(patientId, observationId);

  if (response.status === 404) notFound();
  if (response.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar a observação.
        </p>
      </div>
    );
  }

  const observation = response.data;

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`} aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Observação
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-heading text-base">Dados</CardTitle>
          <CardDescription>
            Data da observação:{" "}
            {dayjs(observation.observedAt).format("DD/MM/YYYY [às] HH:mm")}.
            Criado em {dayjs(observation.createdAt).format("DD/MM/YYYY")};
            atualizado em {dayjs(observation.updatedAt).format("DD/MM/YYYY")}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-heading text-sm text-foreground whitespace-pre-wrap">
            {observation.content}
          </p>
          {observation.tags && (
            <p className="font-heading text-xs text-muted-foreground">
              Tags: {observation.tags}
            </p>
          )}
        </CardContent>
      </Card>

      <EditObservationForm
        patientId={patientId}
        observationId={observation.id}
        initialContent={observation.content}
        initialObservedAt={observation.observedAt.slice(0, 16)}
        initialTags={observation.tags ?? ""}
      />
    </div>
  );
}
