"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIMask } from "react-imask";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dateIsNotInFuture, isValidDate } from "@/helpers/validation";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  sex: z.enum(["male", "female"]),
  dateOfBirth: z.string().min(10).refine(isValidDate).refine(dateIsNotInFuture),
});

type FormValues = z.infer<typeof formSchema>;

type UpsertPatientFormProps = {
  onSuccess?: () => void;
  defaultValues?: FormValues;
  isUpdate?: boolean;
  dialogIsOpen: boolean;
};

const UpsertPatientForm = ({
  onSuccess,
  defaultValues,
  isUpdate = false,
  dialogIsOpen,
}: UpsertPatientFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      sex: "male",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (dialogIsOpen) {
      form.reset(defaultValues);
    }
  }, [dialogIsOpen, defaultValues, form]);

  // Move useIMask hooks to component level
  const { ref: phoneMaskRef, value: phoneMaskValue } = useIMask(
    {
      mask: "(00) 0 0000-0000",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onAccept: (value: string, mask: any) =>
        form.setValue("phone", mask.unmaskedValue),
    },
    {
      defaultValue: form.watch("phone") || "",
    },
  );

  const { ref: dateMaskRef, value: dateMaskValue } = useIMask(
    {
      mask: "00/00/0000",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onAccept: (value: string, mask: any) =>
        form.setValue("dateOfBirth", mask.unmaskedValue),
    },
    {
      defaultValue: form.watch("dateOfBirth") || "",
    },
  );

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      form.reset();
      toast.success(
        isUpdate
          ? "Paciente atualizado com sucesso!"
          : "Paciente adicionado com sucesso!",
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(
        isUpdate
          ? "Erro ao atualizar paciente."
          : "Erro ao adicionar paciente.",
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    upsertPatientAction.execute(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isUpdate ? "Atualizar o paciente" : "Adicionar um Paciente"}
        </DialogTitle>
        <DialogDescription>
          {isUpdate
            ? "Atualize as informações necessárias do paciente."
            : "Preencha os dados do paciente para adicioná-lo à sua clínica."}
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
              return (
                <FormItem>
                  <FormLabel>Número para contato</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={(el) => {
                        // Assign the input element to the phoneMaskRef.current
                        if (
                          typeof phoneMaskRef === "object" &&
                          phoneMaskRef !== null
                        ) {
                          phoneMaskRef.current = el;
                        }
                      }}
                      placeholder="(00) 0 0000-0000"
                      value={phoneMaskValue}
                      onChange={() => {}} // Controlled by useIMask
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
                return (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={(el) => {
                          if (
                            typeof dateMaskRef === "object" &&
                            dateMaskRef !== null
                          ) {
                            dateMaskRef.current = el;
                          }
                        }}
                        placeholder="00/00/0000"
                        value={dateMaskValue}
                        onChange={() => {}} // Controlled by useIMask
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
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {isUpdate ? "Atualizar Paciente" : "Adicionar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
