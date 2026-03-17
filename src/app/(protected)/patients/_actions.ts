"use server";

import {
  createPatient,
  updatePatient,
} from "@/app/_lib/api/fetch-generated";
import { formatValidationError } from "@/app/_lib/api-errors";

export async function createPatientAction(formData: {
  name: string;
  notes?: string | null;
}) {
  const trimmedName = formData.name?.trim();
  if (!trimmedName) {
    return { ok: false, error: "Nome é obrigatório." };
  }

  const response = await createPatient({
    name: trimmedName,
    notes: formData.notes?.trim() || null,
  });

  if (response.status === 201) {
    return { ok: true, patientId: response.data.id };
  }

  if (response.status === 401) {
    return { ok: false, error: "Não autorizado." };
  }

  if ((response as { status: number }).status === 400) {
    return {
      ok: false,
      error: formatValidationError(
        (response as { data: unknown }).data,
      ),
    };
  }

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao criar paciente.";
  return { ok: false, error: message };
}

export async function updatePatientAction(
  patientId: string,
  formData: { name?: string; notes?: string | null; isActive?: boolean }
) {
  const body: { name?: string; notes?: string | null; isActive?: boolean } =
    {};
  if (formData.name !== undefined) {
    const trimmed = formData.name.trim();
    if (!trimmed) return { ok: false, error: "Nome é obrigatório." };
    body.name = trimmed;
  }
  if (formData.notes !== undefined) body.notes = formData.notes || null;
  if (formData.isActive !== undefined) body.isActive = formData.isActive;

  const response = await updatePatient(patientId, body);

  if (response.status === 200) {
    return { ok: true };
  }

  if (response.status === 401) {
    return { ok: false, error: "Não autorizado." };
  }
  if (response.status === 404) {
    return { ok: false, error: "Paciente não encontrado." };
  }

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao atualizar paciente.";
  return { ok: false, error: message };
}
