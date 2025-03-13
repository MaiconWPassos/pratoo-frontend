import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/external/components/ui/dropdown-menu";
import { Cookie, LogOut, Minus, Plus, User } from "lucide-react";
import constants from "@/domain/styles/constants";
import { Button } from "@/external/components/ui/button";
import Cookies from "js-cookie";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/external/components/ui/dialog";
import { Input } from "@/external/components/ui/input";
import { useState } from "react";
import { formatToReal } from "@/domain/lib/validation";
import { exceptionValidation } from "@/domain/lib/error";
import { api } from "@/domain/lib/api";
interface Props {
  user: User | null;
}

export default function Navigation({ user }: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => setQuantity(quantity + 1);
  const handleRemove = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };

  const handleCreateCheckout = async () => {
    try {
      const { data } = await api.post<ResponseApi<CheckoutResponse>>(
        "/checkout",
        {
          quantity,
        }
      );

      window.location.href = data.data.url;
    } catch (error: any) {
      const { message } = exceptionValidation(error);

      alert(message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="mx-4 flex items-center gap-2 border-"
              title="Ovo Coin"
            >
              <img src="/ovo-coin.svg" className="w-8" alt="ovo-coin" />
              <p className="font-bold">{user.credits}</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comprar Ovos Coin</DialogTitle>
              <div className="p-4 flex items-center gap-4">
                <img src="/ovo-coin.svg" className="w-16" alt="ovo-coin" />
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    disabled={quantity === 1}
                    onClick={handleRemove}
                  >
                    <Minus />
                  </Button>
                  <Input
                    type="number"
                    className="no-spinner w-12 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleAdd}
                    className="cursor-pointer"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
              <Button variant="brand" onClick={handleCreateCheckout}>
                Comprar {quantity} por {formatToReal(quantity)}
              </Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              <User size={constants.iconSize} />{" "}
              {user?.name.substring(0, 2).toUpperCase()}
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
                className="cursor-pointer hover:underline"
              >
                <Cookie size={constants.iconSize} /> Minhas receitas
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                variant="link"
                aria-label="Sair"
                role="button"
                className="cursor-pointer"
                onClick={() => {
                  Cookies.remove("__session");
                  window.location.href = "/auth/login";
                }}
              >
                <LogOut size={constants.iconSize} /> Sair
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
