"use server";

import {
  createStructuredAssessment,
  updateStructuredAssessment,
} from "@/app/_lib/api/fetch-generated";

function parsePayload(raw: string): { [key: string]: unknown } {
  const trimmed = raw?.trim();
  if (!trimmed) return {};
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function createAssessmentAction(
  patientId: string,
  formData: { protocolId: string; assessedAt: string; payloadJson: string }
) {
  const protocolId = formData.protocolId?.trim();
  if (!protocolId) {
    return { ok: false, error: "Selecione o protocolo." };
  }

  const assessedAt = formData.assessedAt?.trim();
  if (!assessedAt) {
    return { ok: false, error: "Informe a data da avaliação." };
  }

  // datetime-local retorna "YYYY-MM-DDTHH:mm" -> converter para ISO com Z
  const isoDate =
    assessedAt.length === 16 ? `${assessedAt}:00.000Z` : assessedAt;

  const payload = parsePayload(formData.payloadJson ?? "");

  const response = await createStructuredAssessment(patientId, {
    protocolId,
    payload,
    assessedAt: isoDate,
  });

  if (response.status === 201) {
    return { ok: true, assessmentId: response.data.id };
  }

  if (response.status === 401) return { ok: false, error: "Não autorizado." };
  if (response.status === 404)
    return { ok: false, error: "Paciente não encontrado." };

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao criar avaliação.";
  return { ok: false, error: message };
}

export async function updateAssessmentAction(
  patientId: string,
  assessmentId: string,
  formData: { assessedAt?: string; payloadJson?: string }
) {
  const body: { payload?: { [key: string]: unknown }; assessedAt?: string } =
    {};

  if (formData.payloadJson !== undefined) {
    body.payload = parsePayload(formData.payloadJson);
  }

  if (formData.assessedAt?.trim()) {
    const assessedAt = formData.assessedAt.trim();
    body.assessedAt =
      assessedAt.length === 16 ? `${assessedAt}:00.000Z` : assessedAt;
  }

  const response = await updateStructuredAssessment(
    patientId,
    assessmentId,
    body,
  );

  if (response.status === 200) {
    return { ok: true };
  }

  if (response.status === 401) return { ok: false, error: "Não autorizado." };
  if (response.status === 404)
    return { ok: false, error: "Avaliação não encontrada." };

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao atualizar avaliação.";
  return { ok: false, error: message };
}
