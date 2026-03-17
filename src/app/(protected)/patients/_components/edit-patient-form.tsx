"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePatientAction } from "../_actions";
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

interface EditPatientFormProps {
  patientId: string;
  initialName: string;
  initialNotes: string;
  initialIsActive: boolean;
}

export function EditPatientForm({
  patientId,
  initialName,
  initialNotes,
  initialIsActive,
}: EditPatientFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) ?? "";
    const notes = (formData.get("notes") as string) ?? "";
    const isActive = formData.get("isActive") === "on";

    const result = await updatePatientAction(patientId, {
      name,
      notes: notes || null,
      isActive,
    });

    setIsPending(false);

    if (result.ok) {
      router.refresh();
      return;
    }

    setError(result.error ?? "Erro ao atualizar paciente.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Editar paciente</CardTitle>
          <CardDescription>
            Altere nome, observações ou status (ativo/inativo).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="font-heading text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-heading">
              Nome *
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialName}
              placeholder="Nome do paciente"
              className="font-heading"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes" className="font-heading">
              Observações
            </Label>
            <Input
              id="notes"
              name="notes"
              defaultValue={initialNotes}
              placeholder="Anotações gerais (opcional)"
              className="font-heading"
              disabled={isPending}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={initialIsActive}
              disabled={isPending}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isActive" className="font-heading">
              Paciente ativo
            </Label>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando…" : "Salvar alterações"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
