"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Field, FieldLabel } from "./ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"

export function DatePickerWithRange({ value, onChange, }: {
    value: DateRange | undefined;
    onChange: (date: DateRange | undefined) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`w-[260px] justify-start text-left font-normal bg-gray-50 border-gray-100 shadow-none ${!value?.from ? "text-muted-foreground" : ""}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {value?.from ? (
                        value.to ? (
                            <>
                                {format(value.from, "dd.MM.yyyy")} -{" "}
                                {format(value.to, "dd.MM.yyyy")}
                            </>
                        ) : (
                            format(value.from, "dd.MM.yyyy")
                        )
                    ) : (
                        <span>Wybierz zakres dat</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}
