import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/app/profile/_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const user = session.data?.user;
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="text-xl">
            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-lg font-semibold text-foreground">
            {user.name}
          </h1>
          <p className="font-heading text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
