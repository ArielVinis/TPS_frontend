import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { authClient } from "@/app/_lib/auth-client";
import { LogoutButton } from "@/app/profile/_components/logout-button";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <Link
          href="/patients"
          className="font-heading text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          TPS.AI
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/patients"
            className="font-heading text-sm font-medium text-foreground hover:text-foreground/80"
          >
            Pacientes
          </Link>
          <Link
            href="/protocols"
            className="font-heading text-sm font-medium text-foreground hover:text-foreground/80"
          >
            Protocolos
          </Link>
          <Link
            href="/profile"
            className="font-heading text-sm font-medium text-foreground hover:text-foreground/80"
          >
            Perfil
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
