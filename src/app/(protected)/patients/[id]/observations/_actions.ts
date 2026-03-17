"use server";

import {
  createUnstructuredObservation,
  updateUnstructuredObservation,
} from "@/app/_lib/api/fetch-generated";

function toIsoDate(local: string): string {
  const trimmed = local?.trim();
  if (!trimmed) return "";
  return trimmed.length === 16 ? `${trimmed}:00.000Z` : trimmed;
}

export async function createObservationAction(
  patientId: string,
  formData: { content: string; observedAt: string; tags?: string }
) {
  const content = formData.content?.trim();
  if (!content) {
    return { ok: false, error: "Conteúdo é obrigatório." };
  }

  const observedAt = toIsoDate(formData.observedAt ?? "");
  if (!observedAt) {
    return { ok: false, error: "Informe a data da observação." };
  }

  const response = await createUnstructuredObservation(patientId, {
    content,
    observedAt,
    tags: formData.tags?.trim() || null,
  });

  if (response.status === 201) {
    return { ok: true, observationId: response.data.id };
  }

  if (response.status === 401) return { ok: false, error: "Não autorizado." };
  if (response.status === 404)
    return { ok: false, error: "Paciente não encontrado." };

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao criar observação.";
  return { ok: false, error: message };
}

export async function updateObservationAction(
  patientId: string,
  observationId: string,
  formData: { content?: string; observedAt?: string; tags?: string }
) {
  const body: { content?: string; observedAt?: string; tags?: string | null } =
    {};

  if (formData.content !== undefined) {
    const content = formData.content.trim();
    if (!content) return { ok: false, error: "Conteúdo é obrigatório." };
    body.content = content;
  }
  if (formData.observedAt !== undefined) {
    const observedAt = toIsoDate(formData.observedAt);
    if (observedAt) body.observedAt = observedAt;
  }
  if (formData.tags !== undefined) body.tags = formData.tags?.trim() || null;

  const response = await updateUnstructuredObservation(
    patientId,
    observationId,
    body,
  );

  if (response.status === 200) {
    return { ok: true };
  }

  if (response.status === 401) return { ok: false, error: "Não autorizado." };
  if (response.status === 404)
    return { ok: false, error: "Observação não encontrada." };

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao atualizar observação.";
  return { ok: false, error: message };
}
