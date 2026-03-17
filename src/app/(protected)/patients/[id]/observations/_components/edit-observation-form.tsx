"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateObservationAction } from "../_actions";
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

interface EditObservationFormProps {
  patientId: string;
  observationId: string;
  initialContent: string;
  initialObservedAt: string;
  initialTags: string;
}

export function EditObservationForm({
  patientId,
  observationId,
  initialContent,
  initialObservedAt,
  initialTags,
}: EditObservationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await updateObservationAction(
      patientId,
      observationId,
      {
        content: (formData.get("content") as string) ?? "",
        observedAt: (formData.get("observedAt") as string) ?? "",
        tags: (formData.get("tags") as string) ?? "",
      },
    );

    setIsPending(false);

    if (result.ok) {
      router.refresh();
      return;
    }

    setError(result.error ?? "Erro ao atualizar observação.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Editar observação</CardTitle>
          <CardDescription>
            Altere conteúdo, data e/ou tags.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="font-heading text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="content" className="font-heading">
              Conteúdo *
            </Label>
            <textarea
              id="content"
              name="content"
              required
              defaultValue={initialContent}
              rows={4}
              disabled={isPending}
              className="border-input w-full rounded-md border bg-transparent px-3 py-2 font-heading text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="observedAt" className="font-heading">
              Data da observação
            </Label>
            <Input
              id="observedAt"
              name="observedAt"
              type="datetime-local"
              defaultValue={initialObservedAt}
              disabled={isPending}
              className="font-heading"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags" className="font-heading">
              Tags (opcional)
            </Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={initialTags}
              placeholder="ex.: vestibular, circuito"
              disabled={isPending}
              className="font-heading"
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
