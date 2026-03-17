"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivityItem {
  name?: string;
  sensorySystem?: string;
  objective?: string;
  notes?: string;
}

interface ScaleItem {
  name?: string;
  purpose?: string;
  reference?: string;
}

interface AiResponseContentProps {
  hypotheses: string;
  activitiesJson: string | null;
  scalesJson: string | null;
  inputSummary: string | null;
}

function parseJsonArray<T>(raw: string | null): T[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AiResponseContent({
  hypotheses,
  activitiesJson,
  scalesJson,
  inputSummary,
}: AiResponseContentProps) {
  const activities = parseJsonArray<ActivityItem>(activitiesJson);
  const scales = parseJsonArray<ScaleItem>(scalesJson);

  return (
    <div className="flex flex-col gap-6">
      {inputSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Resumo do contexto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-sm text-muted-foreground whitespace-pre-wrap">
              {inputSummary}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Hipóteses</CardTitle>
          <CardDescription>
            Sugestões da IA para apoio ao raciocínio clínico. Valide com seu
            julgamento profissional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-heading text-sm text-foreground whitespace-pre-wrap">
            {hypotheses}
          </div>
        </CardContent>
      </Card>

      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Atividades sugeridas
            </CardTitle>
            <CardDescription>
              Possíveis atividades de integração sensorial para considerar na
              intervenção.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {activities.map((a, i) => (
                <li
                  key={i}
                  className="rounded-md border border-border p-3 font-heading text-sm"
                >
                  <p className="font-semibold text-foreground">{a.name ?? "—"}</p>
                  {a.sensorySystem && (
                    <p className="mt-1 text-muted-foreground">
                      Sistema sensorial: {a.sensorySystem}
                    </p>
                  )}
                  {a.objective && (
                    <p className="mt-1 text-muted-foreground">
                      Objetivo: {a.objective}
                    </p>
                  )}
                  {a.notes && (
                    <p className="mt-1 text-muted-foreground">{a.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {scales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Escalas sugeridas
            </CardTitle>
            <CardDescription>
              Possíveis instrumentos para aprofundar avaliação ou monitorar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {scales.map((s, i) => (
                <li
                  key={i}
                  className="rounded-md border border-border p-3 font-heading text-sm"
                >
                  <p className="font-semibold text-foreground">{s.name ?? "—"}</p>
                  {s.purpose && (
                    <p className="mt-1 text-muted-foreground">
                      Finalidade: {s.purpose}
                    </p>
                  )}
                  {s.reference && (
                    <p className="mt-1 text-muted-foreground text-xs">
                      Referência: {s.reference}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {activities.length === 0 && scales.length === 0 && !hypotheses.trim() && (
        <p className="font-heading text-sm text-muted-foreground">
          Nenhum conteúdo de atividades ou escalas nesta análise.
        </p>
      )}
    </div>
  );
}
