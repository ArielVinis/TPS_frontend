import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AssessmentNotFound() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-5">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Avaliação não encontrada
      </h1>
      <p className="text-center font-heading text-sm text-muted-foreground">
        A avaliação pode ter sido removida ou você não tem permissão para
        acessá-la.
      </p>
      <Button asChild>
        <Link href="/patients">Voltar à lista de pacientes</Link>
      </Button>
    </div>
  );
}
