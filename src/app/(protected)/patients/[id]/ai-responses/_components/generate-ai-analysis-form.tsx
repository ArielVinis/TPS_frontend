"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateAiAnalysisAction } from "../_actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GenerateAiAnalysisFormProps {
  patientId: string;
  assessments: { id: string; label: string }[];
  observations: { id: string; label: string }[];
}

export function GenerateAiAnalysisForm({
  patientId,
  assessments,
  observations,
}: GenerateAiAnalysisFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>(
    [],
  );
  const [selectedObservationIds, setSelectedObservationIds] = useState<
    string[]
  >([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setRetryAfterSeconds(null);
    setIsPending(true);

    const result = await generateAiAnalysisAction(patientId, {
      assessmentIds:
        selectedAssessmentIds.length > 0 ? selectedAssessmentIds : undefined,
      observationIds:
        selectedObservationIds.length > 0 ? selectedObservationIds : undefined,
    });

    setIsPending(false);

    if (result.ok && result.aiResponseId) {
      router.push(`/patients/${patientId}/ai-responses/${result.aiResponseId}`);
      return;
    }

    setError(result.error ?? "Erro ao gerar análise.");
    if (result.retryAfterSeconds != null) {
      setRetryAfterSeconds(result.retryAfterSeconds);
    }
  }

  function toggleAssessment(id: string) {
    setSelectedAssessmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleObservation(id: string) {
    setSelectedObservationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Gerar análise</CardTitle>
          <CardDescription>
            Opcionalmente selecione quais avaliações e observações incluir. Se
            não selecionar nada, a IA usará os dados recentes do paciente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <div
              className="font-heading text-sm text-destructive"
              role="alert"
            >
              <p>{error}</p>
              {retryAfterSeconds != null && (
                <p className="mt-1">
                  Aguarde {retryAfterSeconds} segundos antes de tentar novamente.
                </p>
              )}
            </div>
          )}

          {assessments.length > 0 && (
            <div className="grid gap-2">
              <Label className="font-heading">Avaliações a incluir</Label>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto rounded-md border border-border p-2">
                {assessments.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center gap-2 font-heading text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAssessmentIds.includes(a.id)}
                      onChange={() => toggleAssessment(a.id)}
                      disabled={isPending}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span className="truncate">{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {observations.length > 0 && (
            <div className="grid gap-2">
              <Label className="font-heading">Observações a incluir</Label>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto rounded-md border border-border p-2">
                {observations.map((o) => (
                  <label
                    key={o.id}
                    className="flex items-center gap-2 font-heading text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedObservationIds.includes(o.id)}
                      onChange={() => toggleObservation(o.id)}
                      disabled={isPending}
                      className="h-4 w-4 rounded border-input"
                    />
                    <span className="truncate">{o.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Gerando análise…" : "Gerar análise com IA"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.push(`/patients/${patientId}`)}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
