"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAssessmentAction } from "../_actions";
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

interface EditAssessmentFormProps {
  patientId: string;
  assessmentId: string;
  initialAssessedAt: string;
  initialPayloadJson: string;
}

export function EditAssessmentForm({
  patientId,
  assessmentId,
  initialAssessedAt,
  initialPayloadJson,
}: EditAssessmentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await updateAssessmentAction(patientId, assessmentId, {
      assessedAt: (formData.get("assessedAt") as string) ?? "",
      payloadJson: (formData.get("payloadJson") as string) ?? "{}",
    });

    setIsPending(false);

    if (result.ok) {
      router.refresh();
      return;
    }

    setError(result.error ?? "Erro ao atualizar avaliação.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Editar avaliação</CardTitle>
          <CardDescription>
            Altere a data e/ou o payload (JSON). O protocolo não pode ser
            alterado.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="font-heading text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="assessedAt" className="font-heading">
              Data da avaliação
            </Label>
            <Input
              id="assessedAt"
              name="assessedAt"
              type="datetime-local"
              defaultValue={initialAssessedAt}
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
              defaultValue={initialPayloadJson}
              rows={6}
              disabled={isPending}
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : "Salvar alterações"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
