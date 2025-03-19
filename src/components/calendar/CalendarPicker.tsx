import { Calendar, CalendarProps } from "@/components/ui/calendar"
import { useState } from "react";
import Button from "../buttons";

type CalendarPickerProps = CalendarProps & {
    onNewDateApplied?: (date: Date) => void
}

export const CalendarPicker = ({ onNewDateApplied, ...props }: CalendarPickerProps) => {
    const [date, setDate] = useState<Date>(new Date())

    function handleOnNewDateRangeApplied() {
        onNewDateApplied?.(date)
    }

    return <div>
        <Calendar
        mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            {...props as any}
        />

        <div className="flex justify-end px-4 py-4">
            <Button onClick={handleOnNewDateRangeApplied} variant="contained" className="self-end h-9">Apply</Button>
        </div>
    </div>
}