"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { ptBR } from "react-day-picker/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  doctorWasSelected?: boolean;
};

export function DatePicker({
  value: date,
  onChange: setDate,
  doctorWasSelected = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={`flex flex-col gap-3 ${!doctorWasSelected ? "cursor-not-allowed" : ""}`}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 cursor-pointer justify-between font-normal"
            disabled={!doctorWasSelected}
          >
            {date && doctorWasSelected
              ? date.toLocaleDateString()
              : "Selecione uma data"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            disabled={{
              before: new Date(),
            }}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
