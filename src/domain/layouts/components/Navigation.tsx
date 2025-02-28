import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/external/components/ui/dropdown-menu";
import { User } from "lucide-react";
import constants from "@/domain/styles/constants";
import { Button } from "@/external/components/ui/button";

interface Props {
  user: User | null;
}
export default function Navigation({ user }: Props) {
  return (
    <div className="flex items-center">
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <User size={constants.iconSize} /> {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xs">
              Minha conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href="/app/dishes"
                aria-label="👨‍🍳 Minhas receitas"
                role="button"
              >
                👨‍🍳 Minhas receitas
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
