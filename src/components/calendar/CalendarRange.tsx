import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { useState } from "react";
import Button from "../buttons";

export type DateRange = {
  from: Date;
  to?: Date;
};

type CalendarRangeProps = CalendarProps & {
  onNewDateApplied?: (date: DateRange) => void;
  dateRange?: {
    from: Date,
    to?: Date
  }
};

export const CalendarRange = ({
  onNewDateApplied,
  dateRange,
  ...props
}: CalendarRangeProps) => {
  const [date, setDate] = useState<DateRange>(dateRange || {
    from: new Date(),
    to: new Date(),
  });

  function onDateRangeSelected(date: DateRange) {
    if (date) {
      setDate((prevDate) =>
        Object.assign({}, prevDate, {
          from: date.from || new Date(),
          to: date.to || new Date(),
        })
      );
    }
  }

  function handleOnNewDateRangeApplied() {
    onNewDateApplied?.(date);
  }

  return (
    <div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={(date: any) => onDateRangeSelected(date)}
        initialFocus
        {...(props as any)}
      />

      <div className="flex justify-end px-4 py-4">
        <Button
          onClick={handleOnNewDateRangeApplied}
          variant="contained"
          className="self-end h-9"
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
