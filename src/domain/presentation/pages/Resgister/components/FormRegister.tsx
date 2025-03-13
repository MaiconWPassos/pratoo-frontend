import { Button } from "@/external/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/external/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/external/components/ui/form";
import { Input } from "@/external/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Cookies from "js-cookie";
import { api } from "@/domain/lib/api";
import { exceptionValidation } from "@/domain/lib/error";
import { isValidCPF, maskCPF, maskPhone } from "@/domain/lib/validation";

const formSchema = z.object({
  name: z
    .string({
      message: "Nome obrigatório",
    })
    .min(4, "Digite seu nome completo"),
  email: z.string().email({
    message: "Email inválido",
  }),
  documentNumber: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(14, "CPF inválido")
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "Formato de CPF inválido")
    .refine(isValidCPF, { message: "CPF inválido" }),
  cellphone: z
    .string({
      message: "Celular obrigatório",
    })
    .min(15, "O telefone deve ter 15 caracteres (incluindo máscara)")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use (99) 99999-9999"),
  password: z.string().nonempty({
    message: "Insira sua senha",
  }),
});

export default function FormRegister() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const {
        data: { data },
      } = await api.post<ResponseApi<AuthResponse>>("/auth/register", {
        ...formData,
        cellphone: formData.cellphone.replace(/\D/g, ""),
        documentNumber: formData.documentNumber.replace(/\D/g, ""),
      });

      Cookies.set("__session", data.token, { expires: 7 });
      window.location.href = "/";
    } catch (error) {
      const { message } = exceptionValidation(error);

      if (message.includes("users_documentNumber_key")) {
        form.setError("documentNumber", {
          message: "CPF já cadastrado",
        });
        return;
      }

      if (message.includes("users_cellphone_key")) {
        form.setError("cellphone", {
          message: "Celular já cadastrado",
        });
        return;
      }

      form.setError("password", {
        message,
      });
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Registrar-se</CardTitle>
        <CardDescription>Entre com seus dados se cadastrar.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Seu nome</FormLabel>
                  <FormControl>
                    <Input placeholder="João silva" {...field} type="name" />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentNumber"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CPF"
                      {...field}
                      onChange={(e) => field.onChange(maskCPF(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cellphone"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(99) 99999-9999"
                      {...field}
                      onChange={(e) =>
                        field.onChange(maskPhone(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      {...field}
                      type="password"
                      hasPassword
                    />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="w-full flex-col gap-2">
            <Button type="submit" variant="brand" className="w-full">
              Registrar-se
            </Button>

            <div className="mt-8 w-full">
              <p className="font-light">
                Já tem conta?{" "}
                <Button variant="link" className="p-0" asChild>
                  <a href="/auth/login">Entre</a>
                </Button>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
