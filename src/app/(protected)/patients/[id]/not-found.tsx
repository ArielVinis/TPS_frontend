import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PatientNotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-5">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Paciente não encontrado
      </h1>
      <p className="font-heading text-sm text-muted-foreground text-center">
        O paciente pode ter sido removido ou você não tem permissão para
        acessá-lo.
      </p>
      <Button asChild>
        <Link href="/patients">Voltar para a lista</Link>
      </Button>
    </div>
  );
}
