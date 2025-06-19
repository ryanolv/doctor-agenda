"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIMask } from "react-imask";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { dateIsNotInFuture, isValidDate } from "@/helpers/validation";
import { useAction } from "next-safe-action/hooks";
import { upsertPatient } from "@/actions/upsert-patient";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.string().min(10).refine(isValidDate).refine(dateIsNotInFuture),
});

type FormValues = z.infer<typeof formSchema>;

type UpsertPatientFormProps = {
  onSuccess?: () => void;
};

const UpsertPatientForm = ({ onSuccess }: UpsertPatientFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sex: "male",
      dateOfBirth: "",
    },
  });

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      form.reset();
      toast.success("Paciente adicionado com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Erro ao adicionar paciente, tente novamente mais tarde.");
    },
  });

  const onSubmit = (values: FormValues) => {
    upsertPatientAction.execute(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar um Paciente</DialogTitle>
        <DialogDescription>
          Preencha os detalhes do paciente para adicionar ao sistema.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do paciente" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email para contato</FormLabel>
                <FormControl>
                  <Input placeholder="paciente@example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              const { ref: maskRef, value } = useIMask(
                {
                  mask: "(00) 0 0000-0000",
                  // TODO: set type to mask param
                  onAccept: (value: string, mask: any) =>
                    field.onChange(mask.unmaskedValue),
                },
                {
                  defaultValue: field.value,
                },
              );
              return (
                <FormItem>
                  <FormLabel>Número para contato</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={(el) => {
                        // Assign the input element to the maskRef.current
                        if (typeof maskRef === "object" && maskRef !== null) {
                          // @ts-ignore
                          maskRef.current = el;
                        }
                      }}
                      placeholder="(00) 0 0000-0000"
                      value={value}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div className="flex w-full gap-5">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => {
                const { ref: maskRef, value } = useIMask(
                  {
                    mask: "00/00/0000",
                    // TODO: set type to mask param
                    onAccept: (value: string, mask: any) =>
                      field.onChange(mask.unmaskedValue),
                  },
                  {
                    defaultValue: field.value,
                  },
                );
                return (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={(el) => {
                          if (typeof maskRef === "object" && maskRef !== null) {
                            maskRef.current = el;
                          }
                        }}
                        placeholder="00/00/0000"
                        value={value}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => {
                const togglGroupValue = field.value;
                const handleValueChange = (value: string) => {
                  field.onChange(value);
                };
                return (
                  <FormItem className="w-full">
                    <FormLabel>Sexo</FormLabel>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={togglGroupValue}
                      onValueChange={handleValueChange}
                      onBlur={field.onBlur}
                      className="w-full"
                    >
                      <ToggleGroupItem value="male" className="cursor-pointer">
                        Masculino
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="female"
                        className="cursor-pointer"
                      >
                        Feminino
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormItem>
                );
              }}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="cursor-pointer">
              Adicionar paciente
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
