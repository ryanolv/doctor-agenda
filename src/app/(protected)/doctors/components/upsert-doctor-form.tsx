"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
import { useIMask } from "react-imask";
import { useAction } from "next-safe-action/hooks";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  available_hours_afternoon,
  available_hours_morning,
  specialities,
} from "../constants/upsert-doctor";
import { upsertDoctor } from "@/actions/upsert-doctor";
import { toast } from "sonner";

const formSchema = z
  .object({
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

type FormSchema = z.infer<typeof formSchema>;

type UpsertDoctorFormProps = {
  onSuccess?: () => void;
};

const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      avatarImageUrl: "",
      specialization: "",
      appointmentPrice: 0,
      availableWeekDays: [],
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso!");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar médico.");
    },
  });

  const onSubmit = (values: FormSchema) => {
    upsertDoctorAction.execute({
      ...values,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
        <DialogDescription>Adicione um novo médico.</DialogDescription>
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              const { ref, value, setValue } = useIMask(
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
                      // Fix ref value
                      ref={ref}
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
            <FormField
              control={form.control}
              name="availableFromTime"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Início de expediente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma hora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          {available_hours_morning?.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          {available_hours_afternoon?.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="availableToTime"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Fim de expediente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma hora" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          {available_hours_morning?.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          {available_hours_afternoon?.map((hour) => (
                            <SelectItem key={hour.value} value={hour.value}>
                              {hour.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
