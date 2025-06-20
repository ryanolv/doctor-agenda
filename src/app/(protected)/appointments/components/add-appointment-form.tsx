"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import SelectCombobox from "./select-combobox";
import { DatePicker } from "./date-picker";

import { DoctorDTO, PatientDTO } from "@/types/dto";
import {
  available_hours_morning,
  available_hours_afternoon,
} from "../../doctors/constants/upsert-doctor";
import { createAppointment } from "@/actions/create-appointment";

const appointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  appointmentPrice: z.number(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

type AddAppointmentFormProps = {
  patients: Pick<PatientDTO, "id" | "name">[];
  doctors: Pick<DoctorDTO, "id" | "name" | "appointmentPriceInCents">[];
  onSuccess?: () => void;
};

const AddAppointmentForm = ({
  patients,
  doctors,
  onSuccess,
}: AddAppointmentFormProps) => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      appointmentDate: new Date(),
      appointmentTime: "",
    },
  });

  const watchedDoctorId = form.watch("doctorId");

  useEffect(() => {
    if (watchedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === watchedDoctorId,
      );
      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [watchedDoctorId, doctors]);

  const createAppointmentAction = useAction(createAppointment, {
    onSuccess: () => {
      onSuccess?.();
      form.reset();
      toast.success("Consulta agendada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao agendar consulta, tente novamente mais tarde.");
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    createAppointmentAction.execute(data);
  };

  const onError = (errors: any) => {
    console.error("Form submission errors:", errors);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Consulta</DialogTitle>
        <DialogDescription>
          Preencha os detalhes da consulta para agendar um novo compromisso.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <FormControl>
                  <SelectCombobox
                    options={patients}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Selecione o paciente"
                    searchPlaceholder="Busque o paciente"
                    emptyMessage="Nenhum paciente encontrado."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex items-center gap-5">
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Médico</FormLabel>
                  <FormControl>
                    <SelectCombobox
                      options={doctors}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione o médico"
                      searchPlaceholder="Busque o médico"
                      emptyMessage="Nenhum médico encontrado."
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentPrice"
              render={({ field }) => (
                <FormItem className="cursor-not-allowed">
                  <FormLabel>Valor da consulta</FormLabel>
                  <NumericFormat
                    value={!!watchedDoctorId ? field.value : 0}
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
                    disabled
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-5">
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data da consulta</FormLabel>
                  <DatePicker
                    doctorWasSelected={!!watchedDoctorId}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Horário da consulta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchedDoctorId}
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
            <Button className="cursor-pointer" type="submit">
              Confirmar consulta
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddAppointmentForm;
