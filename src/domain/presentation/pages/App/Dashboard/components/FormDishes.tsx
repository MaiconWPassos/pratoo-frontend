import { Button } from "@/external/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/external/components/ui/form";
import { Input } from "@/external/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/domain/lib/api";
import { exceptionValidation } from "@/domain/lib/error";
import constants from "@/domain/styles/constants";
import Cookies from "js-cookie";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  ingredients: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
    })
  ),
});

export default function FormDishes() {
  const [dish, setDish] = useState<Dish | null>(null);
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

  const handleAddIngredint = () => {
    if (fields.length >= 3) {
      alert(`Limite de ingredients atingido`);
      return;
    }
    append({
      id: crypto.randomUUID(),
      title: "",
    });
  };

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      setDish(null);
      const { data } = await api.post<ResponseApi<Dish>>("/dishes", {
        ingredients: formData.ingredients.map((ing) => ing.title),
      });

      setDish(data.data);
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
          {fields.length < 3 && (
            <Button
              className="w-fit"
              variant="default"
              size="sm"
              onClick={handleAddIngredint}
            >
              <Plus /> Adicionar novo ingrediente
            </Button>
          )}
        </div>

        <Button
          type="submit"
          variant="brand"
          className="w-full items-center"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            "Gerando.."
          ) : (
            <>
              Gerar minha receita
              <div className="flex items-center gap-2 ">
                <img src="/ovo-coin.svg" alt="ovo-coin" className="w-8" />
                <p>2</p>
              </div>
            </>
          )}
        </Button>
      </form>

      {JSON.stringify(dish)}
    </Form>
  );
}
