import Link from "next/link";
import { notFound } from "next/navigation";
import { getAiResponse } from "@/app/_lib/api/fetch-generated";
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
import { AiResponseContent } from "../_components/ai-response-content";

export default async function AiResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string; aiResponseId: string }>;
}) {
  const { id: patientId, aiResponseId } = await params;
  const response = await getAiResponse(patientId, aiResponseId);

  if (response.status === 404) notFound();
  if (response.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar a análise.
        </p>
      </div>
    );
  }

  const aiResponse = response.data;

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`} aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Análise com IA
        </h1>
      </div>

      <p className="font-heading text-xs text-muted-foreground mb-4">
        Gerada em {dayjs(aiResponse.createdAt).format("DD/MM/YYYY [às] HH:mm")}.
      </p>

      <AiResponseContent
        hypotheses={aiResponse.hypotheses}
        activitiesJson={aiResponse.activitiesJson}
        scalesJson={aiResponse.scalesJson}
        inputSummary={aiResponse.inputSummary}
      />
    </div>
  );
}
