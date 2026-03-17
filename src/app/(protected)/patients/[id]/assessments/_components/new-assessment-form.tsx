"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAssessmentAction } from "../_actions";
import { ProtocolSelect } from "@/app/_components/protocol-select";
import type { ProtocolOption } from "@/app/_lib/protocols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NewAssessmentFormProps {
  patientId: string;
  protocols: ProtocolOption[];
}

export function NewAssessmentForm({ patientId, protocols }: NewAssessmentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createAssessmentAction(patientId, {
      protocolId: (formData.get("protocolId") as string) ?? "",
      assessedAt: (formData.get("assessedAt") as string) ?? "",
      payloadJson: (formData.get("payloadJson") as string) ?? "{}",
    });

    setIsPending(false);

    if (result.ok && result.assessmentId) {
      router.push(`/patients/${patientId}/assessments/${result.assessmentId}`);
      return;
    }

    setError(result.error ?? "Erro ao criar avaliação.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Dados da avaliação</CardTitle>
          <CardDescription>
            Protocolo e data são obrigatórios. Payload em JSON (objeto livre).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="font-heading text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="protocolId" className="font-heading">
              Protocolo *
            </Label>
            <ProtocolSelect
              id="protocolId"
              name="protocolId"
              protocols={protocols}
              required
              placeholder="Selecione o protocolo"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assessedAt" className="font-heading">
              Data da avaliação *
            </Label>
            <Input
              id="assessedAt"
              name="assessedAt"
              type="datetime-local"
              required
              disabled={isPending}
              className="font-heading"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payloadJson" className="font-heading">
              Payload (JSON)
            </Label>
            <textarea
              id="payloadJson"
              name="payloadJson"
              defaultValue="{}"
              rows={6}
              placeholder='{"item1": 1, "item2": "valor"}'
              disabled={isPending}
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Criar avaliação"}
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
