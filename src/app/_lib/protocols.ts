import {
  listProtocols,
  ListProtocols200ProtocolsItem,
  ListProtocolsActiveOnly,
} from "@/app/_lib/api/fetch-generated";

export type ProtocolOption = Pick<
  ListProtocols200ProtocolsItem,
  "id" | "name" | "description"
>;

/**
 * Carrega protocolos ativos para uso em formulários (ex.: seletor em "Nova avaliação").
 * Usar em Server Components e passar o resultado para <ProtocolSelect /> em client forms.
 */
export async function getProtocolsForSelect(): Promise<{
  protocols: ProtocolOption[];
  error: string | null;
}> {
  const response = await listProtocols({
    activeOnly: ListProtocolsActiveOnly.true,
  });

  if (response.status !== 200) {
    return {
      protocols: [],
      error:
        response.status === 401
          ? "Não autorizado."
          : "Não foi possível carregar os protocolos.",
    };
  }

  return {
    protocols: response.data.protocols.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
    })),
    error: null,
  };
}
