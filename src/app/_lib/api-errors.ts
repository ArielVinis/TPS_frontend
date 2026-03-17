/**
 * Utilitários para exibir erros da API (validação 400, etc.).
 * A API (Fastify + Zod) pode retornar 400 com body no formato:
 * - { message: string, errors?: Array<{ path: string, message: string }> }
 * - ou outro formato conforme documentação OpenAPI.
 */

export type ApiValidationError = {
  message?: string;
  errors?: Array<{ path?: string; message?: string }>;
};

/**
 * Extrai mensagem legível de um corpo de erro de validação (400).
 * Use quando uma action receber resposta 400 e quiser exibir no formulário.
 */
export function formatValidationError(body: unknown): string {
  if (body == null) return "Dados inválidos. Verifique os campos.";
  if (typeof body === "string") return body;
  if (typeof body !== "object") return "Dados inválidos.";

  const b = body as Record<string, unknown>;
  const message = b.message ?? b.error;
  if (typeof message === "string" && message) return message;

  const errors = b.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const parts = errors
      .filter(
        (e): e is NonNullable<ApiValidationError["errors"]>[number] =>
          e != null && typeof e === "object",
      )
      .map((e) => {
        const path = "path" in e ? String(e.path) : "";
        const msg = "message" in e ? String(e.message) : "";
        return path ? `${path}: ${msg}` : msg;
      })
      .filter(Boolean);
    if (parts.length > 0) return parts.join(". ");
  }

  return "Dados inválidos. Verifique os campos.";
}
