import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatient } from "@/app/_lib/api/fetch-generated";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { NewObservationForm } from "../_components/new-observation-form";

export default async function NewObservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = await params;
  const patientResponse = await getPatient(patientId);

  if (patientResponse.status === 404) notFound();
  if (patientResponse.status !== 200) {
    return (
      <div className="p-5">
        <p className="font-heading text-sm text-destructive">
          Não foi possível carregar o paciente.
        </p>
      </div>
    );
  }

  const patient = patientResponse.data;

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/patients/${patientId}`} aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Nova observação — {patient.name}
        </h1>
      </div>

      <NewObservationForm patientId={patientId} />
    </div>
  );
}
