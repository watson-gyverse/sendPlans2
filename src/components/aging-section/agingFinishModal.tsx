import {useEffect, useState} from "react"
import {Button, FloatingLabel, Form, Modal, Stack} from "react-bootstrap"
import {useForm} from "react-hook-form"
import {finishAging, updateExistingItem} from "../../apis/agingApi"
import {MeatInfoAiO, MeatInfoWithEntry} from "../../utils/types/meatTypes"
import moment from "moment"
import {DatePickerSet} from "../common/datePickerSet"

type FinishAgingFormOptions = {
	finishDate: string
	afterWeight: number
	cutWeight: number
}

type FinishAgingParams = {
	meatInfo: MeatInfoAiO
	finishAgingEvent: (meatInfo: MeatInfoAiO) => void
	show: boolean
	setShow: (show: boolean) => void
}

export default function FinishAgingModal(props: FinishAgingParams) {
	const {meatInfo, finishAgingEvent, show, setShow} = props

	const [changableAw, setAwChangable] = useState(
		meatInfo.afterWeight !== null || meatInfo.afterWeight !== undefined,
	)
	const [changableCw, setCwChangable] = useState(false)
	const [date, setDate] = useState<Date>(new Date())
	const [time, setTime] = useState<number>(new Date().getHours())
	const [amPm, setAmPm] = useState(false) //true : am , false : pm

	const dateData = {
		date: date,
		setDate: setDate,
		time: time,
		setTime: setTime,
		amPm: amPm,
		setAmPm: setAmPm,
		variant: "danger",
	}
	const {
		register,
		formState,
		formState: {errors},
		watch,
		handleSubmit,
		reset,
	} = useForm<FinishAgingFormOptions>({
		mode: "onSubmit",
		defaultValues: {
			afterWeight: undefined,
			finishDate:
				moment(date).format("YYYY-MM-DD ") + time.toString().padStart(2, "0"),
			cutWeight: undefined,
		},
	})

	const newAfterWeight = meatInfo.afterWeight
		? meatInfo.afterWeight
		: watch("afterWeight")
	const newCutWeight = meatInfo.cutWeight
		? meatInfo.cutWeight
		: watch("cutWeight")
	const finishDate = meatInfo.finishDate
		? meatInfo.finishDate
		: watch("finishDate")

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			reset()
		}
	}, [formState, reset])

	const onSubmit = (data: FinishAgingFormOptions) => {
		// event?.preventDefault()
		const ok = window.confirm("정말 숙성 종료합니다?")
		if (ok) {
			let aIO: MeatInfoAiO = {
				...meatInfo,
				finishDate: finishDate,
				afterWeight: newAfterWeight,
				cutWeight: newCutWeight,
			}
			finishAging(aIO, finishAgingEvent(meatInfo))
		}
	}

	const onSaveClick = () => {
		const {afterWeight, cutWeight, ...unchangedData} = meatInfo
		const finishDateText = moment(finishDate).format("YYYY-MM-DD ")
		const updateData: MeatInfoAiO = {
			...unchangedData,
			afterWeight: newAfterWeight,
			cutWeight: newCutWeight ? newCutWeight : null,
			finishDate: finishDateText,
		}
		updateExistingItem(meatInfo.docId, updateData, () => {
			console.log("updated")

			reset()
			setShow(false)
		})
	}
	return (
		<Modal
			show={show}
			onHide={() => {
				reset()
				setShow(false)
			}}>
			<Modal.Header closeButton>
				<Modal.Title>숙성 완료</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<h6>숙성 종료 시각</h6>
					<DatePickerSet dateData={dateData} />

					<Form.Group style={{marginTop: "10px", marginBottom: "10px"}}>
						<Stack gap={2}>
							{changableAw ? (
								<FloatingLabel label="숙성 후 무게(g)">
									<Form.Control
										type="number"
										placeholder="AfterWeight"
										{...register(
											"afterWeight",
											//  {중간에 종료처리해버릴 수 있게
											// 	required: `숙성 후 무게를 입력해주세요 ${watch(
											// 		"afterWeight",
											// 	)}`,
											// }
										)}
									/>

									{errors.afterWeight?.type === "required" && (
										<h6 style={{color: "red"}}>※무게를 입력해주세요</h6>
									)}
								</FloatingLabel>
							) : (
								<h1>{newAfterWeight}</h1>
							)}
							<button onClick={() => setAwChangable(!changableAw)}>*</button>
							<FloatingLabel label="손질 후 무게(g)">
								<Form.Control
									type="number"
									placeholder="CutWeight"
									{...register(
										"cutWeight",
										// {
										// 	required: `손질 후 무게를 입력해주세요 ${watch(
										// 		"cutWeight",
										// 	)}`,
										// }
									)}
								/>
								{errors.cutWeight?.type === "required" && (
									<h6 style={{color: "red"}}>※무게를 입력해주세요</h6>
								)}
							</FloatingLabel>
						</Stack>
					</Form.Group>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}>
						<Button variant="primary" onClick={onSaveClick}>
							임시저장
						</Button>
						<Button
							variant="danger"
							type="submit"
							style={{
								width: "157px",
								height: "50px",
							}}>
							종료처리
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)
}
