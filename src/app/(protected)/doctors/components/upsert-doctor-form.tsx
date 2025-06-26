"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIMask } from "react-imask";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertDoctor } from "@/actions/upsert-doctor";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { specialities } from "../constants/upsert-doctor";
import SelectTime from "./select-time";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2, {
      message: "Nome é obrigatório.",
    }),
    email: z.string().email(),
    phone: z.string().min(14),
    avatarImageUrl: z.string().optional(),
    specialization: z.string(),
    appointmentPrice: z.number().min(1),
    availableWeekDays: z.array(z.number()),
    availableFromTime: z.string(),
    availableToTime: z.string(),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Escolha outro horário",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;

type UpsertDoctorFormProps = {
  onSuccess?: () => void;
  defaultValues?: UpsertDoctorSchema;
  isUpdate?: boolean;
  dialogIsOpen: boolean;
};

const UpsertDoctorForm = ({
  isUpdate,
  onSuccess,
  defaultValues,
  dialogIsOpen,
}: UpsertDoctorFormProps) => {
  const form = useForm<UpsertDoctorSchema>({
    resolver: zodResolver(upsertDoctorSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      avatarImageUrl: "",
      specialization: "",
      appointmentPrice: 0,
      availableWeekDays: [],
      availableFromTime: "",
      availableToTime: "",
    },
  });

  useEffect(() => {
    if (dialogIsOpen) {
      form.reset(defaultValues);
    }
  }, [dialogIsOpen, defaultValues, form]);

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success(
        isUpdate
          ? "Médico atualizado com sucesso!"
          : "Médico adicionado com sucesso!",
      );
      onSuccess?.();
      form.reset();
    },
    onError: () => {
      toast.error(
        isUpdate ? "Erro ao atualizar médico." : "Erro ao adicionar médico.",
      );
    },
  });

  const onSubmit = (values: UpsertDoctorSchema) => {
    upsertDoctorAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isUpdate ? "Atualizar médico" : "Adicionar médico"}
        </DialogTitle>
        <DialogDescription>
          {isUpdate ? "Atualize os campos necessários." : "Adicione um médico."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do médico" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="medico@example.com" />
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
          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$ "
                />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-5 py-2">
            <FormField
              control={form.control}
              name="availableWeekDays"
              render={({ field }) => {
                const handleValueChange = (selectedValues: string[]) => {
                  const numericValues = selectedValues.map(Number);
                  field.onChange(numericValues);
                };

                const togglGroupValue = field.value
                  ? field.value.map(String)
                  : [];
                return (
                  <FormItem className="w-full">
                    <FormLabel>Dias disponíveis</FormLabel>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      value={togglGroupValue}
                      onValueChange={handleValueChange}
                      onBlur={field.onBlur}
                    >
                      <ToggleGroupItem value="1">S</ToggleGroupItem>
                      <ToggleGroupItem value="2">T</ToggleGroupItem>
                      <ToggleGroupItem value="3">Q</ToggleGroupItem>
                      <ToggleGroupItem value="4">Q</ToggleGroupItem>
                      <ToggleGroupItem value="5">S</ToggleGroupItem>
                    </ToggleGroup>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Especialidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma especialidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialities?.map((speciality) => (
                          <SelectItem
                            key={speciality.value}
                            value={speciality.value}
                          >
                            {speciality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex justify-between gap-5 py-2">
            <SelectTime
              label="Início de expediente"
              param="availableFromTime"
              form={form}
            />
            <SelectTime
              label="Fim de expediente"
              param="availableToTime"
              form={form}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={upsertDoctorAction.isPending}
            >
              {isUpdate ? "Atualizar médico" : "Adicionar médico"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
