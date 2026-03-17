import { listProtocols } from "@/app/_lib/api/fetch-generated";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProtocolsPage() {
  const response = await listProtocols({ activeOnly: undefined });

  if (response.status !== 200) {
    return (
      <div className="p-5">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Protocolos
        </h1>
        <p className="mt-2 font-heading text-sm text-destructive">
          Não foi possível carregar os protocolos. Tente novamente.
        </p>
      </div>
    );
  }

  const protocols = response.data.protocols;

  return (
    <div className="p-5">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Protocolos (tipos de avaliação)
      </h1>
      <p className="mt-1 font-heading text-sm text-muted-foreground">
        Lista de protocolos disponíveis para uso em avaliações estruturadas.
      </p>

      {protocols.length === 0 ? (
        <p className="mt-6 font-heading text-sm text-muted-foreground">
          Nenhum protocolo cadastrado.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {protocols.map((p) => (
            <li key={p.id}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="font-heading text-base">
                    {p.name}
                  </CardTitle>
                  <Badge
                    variant={p.isActive ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {p.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  {p.description && (
                    <CardDescription className="font-heading">
                      {p.description}
                    </CardDescription>
                  )}
                  {p.slug && (
                    <p className="mt-1 font-heading text-xs text-muted-foreground">
                      Slug: {p.slug}
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
