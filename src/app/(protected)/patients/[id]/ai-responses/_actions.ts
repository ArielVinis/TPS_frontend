"use server";

import { generateAiAnalysis } from "@/app/_lib/api/fetch-generated";

export async function generateAiAnalysisAction(
  patientId: string,
  body: { assessmentIds?: string[]; observationIds?: string[] },
) {
  const response = await generateAiAnalysis(patientId, {
    assessmentIds: body.assessmentIds?.length ? body.assessmentIds : undefined,
    observationIds: body.observationIds?.length
      ? body.observationIds
      : undefined,
  });

  if (response.status === 201) {
    return { ok: true, aiResponseId: response.data.id };
  }

  if (response.status === 401) {
    return { ok: false, error: "Não autorizado." };
  }
  if (response.status === 404) {
    return { ok: false, error: "Paciente não encontrado." };
  }

  if (response.status === 429) {
    const retryAfter = response.headers?.get("Retry-After");
    const seconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
    const message =
      "error" in response.data ? response.data.error : "Limite de gerações excedido. Tente novamente em alguns instantes.";
    return { ok: false, error: message, retryAfterSeconds: seconds };
  }

  if (response.status === 502) {
    const message =
      "error" in response.data
        ? response.data.error
        : "Serviço de IA temporariamente indisponível. Tente mais tarde.";
    return { ok: false, error: message, is502: true };
  }

  const message =
    response.status === 500 && "error" in response.data
      ? response.data.error
      : "Erro ao gerar análise.";
  return { ok: false, error: message };
}
