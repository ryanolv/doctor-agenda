"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const OptionsProfile = () => {
  const router = useRouter();
  const session = authClient.useSession();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/authentication");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full">
          <Avatar>
            <AvatarImage src={session.data?.user.image || undefined} />
            <AvatarFallback>FL</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text- font-medium">
              {session.data?.user.clinic.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {session.data?.user.clinic.email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Perfil</DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500"
          onClick={handleSignOut}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OptionsProfile;
