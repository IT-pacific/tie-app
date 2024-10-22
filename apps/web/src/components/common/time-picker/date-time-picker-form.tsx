import React from 'react'
import { format } from "date-fns";
import "react-day-picker/style.css";
import { cn } from "@/utils/tw-merge";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "./time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export default function DateTimePicker({
  selectedDate,
  setSelectedDate,
}: Props) {
  // const handleDateChange = (date: Date | undefined) => {
  //   setSelectedDate(date);
  // };

  const handleTimeChange = (time: Date | undefined) => {
    setSelectedDate(time); // Update the date object with time
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP HH:mm:ss")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-0 bg-white overflow-y-scroll">
        <div className="flex">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="!h-[300px] p-3"
          />

          <div className="p-3 border-t border-border">
            <TimePicker setDate={handleTimeChange} date={selectedDate} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
