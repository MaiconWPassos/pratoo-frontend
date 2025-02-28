import { Button } from "@/external/components/ui/button";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/external/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/external/components/ui/form";
import { Input } from "@/external/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/domain/lib/api";
import { exceptionValidation } from "@/domain/lib/error";
import Cookies from "js-cookie";
import { Plus, Trash } from "lucide-react";
import constants from "@/domain/styles/constants";

const formSchema = z.object({
  ingredients: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
    })
  ),
});

export default function FormDishes() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: [
        {
          id: crypto.randomUUID(),
          title: "",
        },
      ],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form.control,
      name: "ingredients",
    }
  );

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", {
        ingredients: formData.ingredients.map((ing) => ing.title),
      });

      Cookies.set("__session", data.token, { expires: 7 });

      window.location.href = "/app/dashboard";
    } catch (error) {
      const { message } = exceptionValidation(error);
      form.setError("ingredients", {
        message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg mx-auto">
        <h2 className="text-xl font-semibold">
          Gerador de receitas para matar sua fome 😋
        </h2>
        <p className="text-xs text-brand">
          Entre com os ingredientes disponíveis.
        </p>

        <div className="flex flex-col gap-2 my-4">
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`ingredients.${index}.title`}
              render={({ field }) => (
                <div className="flex items-center gap-2 w-full">
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={"Ingrediente " + (index + 1)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Button
                    onClick={() => remove(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash size={constants.iconSize} />
                  </Button>
                </div>
              )}
            />
          ))}
          <Button
            className="w-fit"
            variant="default"
            size="sm"
            onClick={() =>
              append({
                id: crypto.randomUUID(),
                title: "",
              })
            }
          >
            <Plus /> Adicionar novo ingrediente
          </Button>
        </div>

        <Button type="submit" variant="brand" className="w-full">
          Gerar minha receita
        </Button>
      </form>
    </Form>
  );
}
