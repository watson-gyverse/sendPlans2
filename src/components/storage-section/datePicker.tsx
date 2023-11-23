import React, { ForwardedRef, forwardRef, useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "react-bootstrap"

type DatePickerInputProps = {
    value: any
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type DatePickerProps = {
    targetDate: Date
    setTargetDate: (arg0: Date) => void
    variant: string
}

const DatePickerComponent = (props: DatePickerProps) => {
    const { targetDate, setTargetDate, variant } = props

    useEffect(() => {}, [props.targetDate])
    const CustomInput = forwardRef(
        ({ value, onClick }: DatePickerInputProps, ref: ForwardedRef<any>) => (
            <Button
                style={{
                    fontSize: "1.5rem",
                }}
                variant={variant}
                onClick={onClick}
                ref={ref}
            >
                {value}
            </Button>
        )
    )
    return (
        <DatePicker
            selected={targetDate}
            onChange={(date: Date) => setTargetDate(date)}
            customInput={React.createElement(CustomInput)}
            dateFormat='yyyy/MM/dd'
            // showTimeSelect
            // timeIntervals={60}
            // minTime={setHours(setMinutes(new Date(), 0), 0)}
            // maxTime={setHours(setMinutes(new Date(), 30), 23)}
        />
    )
}

export default DatePickerComponent
