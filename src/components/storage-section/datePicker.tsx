import React, {ForwardedRef, forwardRef, useEffect, useState} from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {Button} from "react-bootstrap"
import "./popper.css"
type DatePickerInputProps = {
	value: any
	onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
type DatePickerProps = {
	targetDate: Date
	setTargetDate: (arg0: Date) => void
	variant: string
	fontSize?: string
}

const DatePickerComponent = (props: DatePickerProps) => {
	const {targetDate, setTargetDate, variant, fontSize} = props

	useEffect(() => {}, [props.targetDate])
	const CustomInput = forwardRef(
		({value, onClick}: DatePickerInputProps, ref: ForwardedRef<any>) => (
			<Button
				style={{
					fontSize: fontSize ? fontSize : "1.5rem",

					borderRadius: "0",
				}}
				variant={variant}
				onClick={onClick}
				ref={ref}>
				{value}
			</Button>
		),
	)
	return (
		<div>
			<DatePicker
				popperPlacement="bottom-start"
				// popperProps={{
				// 	positionFixed: true, // use this to make the popper position: fixed
				// }}
				selected={targetDate}
				onChange={(date: Date | null) => {
					if (!date) return
					const a = new Date(date)
					a.setHours(0)
					a.setMinutes(0)
					a.setSeconds(0)
					a.setMilliseconds(0)
					setTargetDate(a)
				}}
				customInput={React.createElement(CustomInput)}
				dateFormat="yyyy/MM/dd"
			/>
		</div>
	)
}

export default DatePickerComponent
