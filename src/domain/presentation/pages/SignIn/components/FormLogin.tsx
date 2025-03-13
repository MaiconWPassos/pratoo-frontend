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
import GoogleLoginButton from "./GoogleLoginButton";

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().nonempty({
    message: "Insira sua senha",
  }),
});

export default function FormLogin() {
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
      } = await api.post<ResponseApi<AuthResponse>>("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      Cookies.set("__session", data.token, { expires: 7 });

      window.location.href = "/";
    } catch (error) {
      const { message } = exceptionValidation(error);
      form.setError("password", {
        message,
      });
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Entre com seus dados para fazer o login.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-4">
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
              Entrar
            </Button>
            <GoogleLoginButton />
            <div className="mt-8 w-full">
              <p className="font-light">
                Não tem conta?{" "}
                <Button variant="link" className="p-0" asChild>
                  <a href="/auth/register">Cadastre-se</a>
                </Button>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
