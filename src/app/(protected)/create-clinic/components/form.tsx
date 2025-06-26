"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const clinicsFormSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  website: z.string().optional(),
});

const ClinicForm = () => {
  const form = useForm<z.infer<typeof clinicsFormSchema>>({
    resolver: zodResolver(clinicsFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof clinicsFormSchema>) => {
    try {
      await createClinic(
        values.name,
        values.address,
        values.phone,
        values.email,
        values.website,
      );
      toast.success("Clínica criada com sucesso.");
      form.reset();
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error(error);
      toast.error("Erro ao criar clínica");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nome <span className="text-xs text-red-800">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nome da clínica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Endereço <span className="text-xs text-red-800">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Bairro jardins, São Paulo, SP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Telefone <span className="text-xs text-red-800">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-xs text-red-800">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="email@clinica.com.br" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site</FormLabel>
              <FormControl>
                <Input placeholder="https://www.clinica.com.br" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClinicForm;
