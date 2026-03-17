import Link from "next/link";
import { NewPatientForm } from "../_components/new-patient-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NewPatientPage() {
  return (
    <div className="p-5">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/patients" aria-label="Voltar">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Novo paciente
        </h1>
      </div>
      <NewPatientForm />
    </div>
  );
}
