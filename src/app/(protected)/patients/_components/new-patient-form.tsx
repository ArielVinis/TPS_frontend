"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatientAction } from "../_actions";
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

export function NewPatientForm() {
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

    const result = await createPatientAction({ name, notes: notes || null });

    setIsPending(false);

    if (result.ok && result.patientId) {
      router.push(`/patients/${result.patientId}`);
      return;
    }

    setError(result.error ?? "Erro ao criar paciente.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Dados do paciente</CardTitle>
          <CardDescription>
            Nome é obrigatório. Observações são opcionais.
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
              placeholder="Anotações gerais (opcional)"
              className="font-heading"
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Cadastrar paciente"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => router.push("/patients")}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
