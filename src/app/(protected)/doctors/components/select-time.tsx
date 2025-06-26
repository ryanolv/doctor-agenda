import { UseFormReturn } from "react-hook-form";

import {
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

import {
  available_hours_afternoon,
  available_hours_morning,
} from "../constants/upsert-doctor";
import { UpsertDoctorSchema } from "./upsert-doctor-form";

type SelectTimeProps = {
  label: string;
  param: keyof Pick<
    UpsertDoctorSchema,
    "availableFromTime" | "availableToTime"
  >;
  form: UseFormReturn<UpsertDoctorSchema>;
};

const SelectTime = ({ label, param, form }: SelectTimeProps) => {
  return (
    <FormField
      control={form.control}
      name={param}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
  );
};

export default SelectTime;
