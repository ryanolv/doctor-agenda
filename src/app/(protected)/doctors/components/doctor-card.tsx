import { Calendar, Clock, DollarSign } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { convertTimeToTimezone } from "@/helpers/timezone";
import { DoctorDTO } from "@/types/dto";

import { daysOfWeek } from "../constants/upsert-doctor";
import UpdateDoctorButton from "./update-doctor-button";

type DoctorCardProps = {
  doctor: DoctorDTO;
};

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const availableFromTimeLocal = convertTimeToTimezone(
    doctor.availableFromTime,
  ).slice(0, 5);
  const availableToTimeLocal = convertTimeToTimezone(
    doctor.availableToTime,
  ).slice(0, 5);

  return (
    <Card className="relative h-96 w-72">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-17 w-17">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">
              {doctor.specialization}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4.5">
        <span className="flex w-fit items-center gap-1 rounded-xl bg-yellow-500/10 px-2 py-1 text-xs">
          <Calendar size={14} />
          Das {availableFromTimeLocal} às {availableToTimeLocal}
        </span>
        <div className="grid grid-cols-3 justify-items-center gap-2">
          {doctor.availableWeekdays.map((day) => (
            <span
              key={day}
              className="bg-primary/10 flex w-fit items-center gap-1 rounded-xl px-2 py-1 text-xs"
            >
              <Clock size={14} />
              {daysOfWeek.find((d) => d.value === day)?.label || ""}
            </span>
          ))}
        </div>
        <span className="flex w-fit items-center gap-1 rounded-xl bg-green-500/10 px-2 py-1 text-xs">
          <DollarSign size={14} />
          R${doctor.appointmentPriceInCents / 100}
        </span>
      </CardContent>
      <CardFooter className="absolute bottom-4.5 w-full">
        <UpdateDoctorButton doctor={doctor} />
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
