import moment from "moment"
import {useEffect, useState} from "react"
import {Modal} from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import {useForm} from "react-hook-form"
import styled from "styled-components"
import "../../screens/stock-section/button.css"
import {backgroundColors} from "../../utils/consts/colors"
import {MeatInfoWithEntry} from "../../utils/types/meatTypes"
import {DatePickerSet} from "../common/datePickerSet"

type AgingFormOptions = {
	fridgeName: string
	floor: number
	beforeWeight: number
	agingDate: string
	// ultraTime: number
}

type AgingModalParams = {
	meatInfo: MeatInfoWithEntry
	placeName: string
	placeCount: number
	setMeatInfo: (mInfo: MeatInfoWithEntry) => void
	setClose: () => void
	show: boolean
	setShow: (show: boolean) => void
}

function AgingModal(props: AgingModalParams) {
	const {
		meatInfo,
		placeName,
		placeCount,
		setMeatInfo,
		setClose,
		show,
		setShow,
	} = props
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

	useEffect(() => {
		console.log(date, time, amPm)
		console.log(
			moment(date).format("YYYY-MM-DD ") +
				(amPm ? time : time + 12).toString().padStart(2, "0"),
		)
	}, [date, time, amPm])

	const {
		register,
		formState,
		formState: {errors},
		handleSubmit,
		reset,
		getValues,
		setValue,
	} = useForm<AgingFormOptions>({
		// mode: "onSubmit",
		defaultValues: {
			agingDate: "",
			fridgeName: "",
			floor: undefined,
			beforeWeight: undefined,
			// ultraTime: 0,
		},
	})

	const onSubmit = (data: AgingFormOptions) => {
		console.log("data submitted")
		const newInfo = {
			...meatInfo,
			beforeWeight: data.beforeWeight,
			fridgeName: data.fridgeName,
			floor: data.floor,
			place: placeName,
			agingDate:
				moment(date).format("YYYY-MM-DD ") +
				(amPm ? time : time + 12).toString().padStart(2, "0"),
			// ultraTime: data.ultraTime,
		}
		console.log(newInfo)
		setMeatInfo(newInfo)
		setDate(new Date())
		setTime(new Date().getHours())
		setAmPm(false)
		if (formState.isSubmitSuccessful) {
			reset()
		}
		setClose()
	}

	const onError = (error: any) => {
		console.log("ERROR:::", error)
	}

	const onOverBorderCount = (v: string) => {
		if (parseInt(v) > placeCount) setValue("fridgeName", placeCount.toString())
		if (parseInt(v) <= 0) setValue("fridgeName", "1")
	}
	console.count()
	return (
		<Modal
			show={show}
			onHide={() => {
				setDate(new Date())
				setTime(new Date().getHours())
				setAmPm(false)
				setShow(false)
				reset()
			}}>
			<Modal.Header
				style={{backgroundColor: backgroundColors.storedCard}}
				closeButton>
				<Modal.Title>
					<LabelText>숙성 전 정보 입력/수정</LabelText>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{backgroundColor: backgroundColors.storedCard}}>
				<Form onSubmit={handleSubmit(onSubmit, onError)}>
					<LabelText style={{fontWeight: "800"}}>숙성 시작 시각 : </LabelText>{" "}
					<h6>
						{"("}
						{moment(date).format("YYYY-MM-DD ") +
							(amPm ? time : time + 12).toString().padStart(2, "0")}
						{")"}
					</h6>
					<DatePickerSet dateData={dateData} />
					<Form.Group>
						<Form.Label>
							<LabelText style={{fontWeight: "800", margin: "0"}}>
								무게(g) :
							</LabelText>
						</Form.Label>
						<Form.Control
							type="number"
							{...register("beforeWeight", {
								required: `숙성 전 무게를 입력해주세요`,
							})}
						/>
						{errors.beforeWeight?.type === "required" && (
							<h6 style={{color: "red"}}>※무게를 입력해주세요</h6>
						)}
					</Form.Group>
					<Form.Label
						style={{
							width: "auto",
							marginTop: "10px",
							marginRight: "12px",
						}}>
						<LabelText style={{fontWeight: "800"}}> 냉장고 번호 :</LabelText>
					</Form.Label>
					<div
						style={{
							display: "flex",
							padding: "0 80px",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<button type="button" onClick={() => setValue("fridgeName", "2")}>
							2
						</button>
						<button
							type="button"
							className="btn-two mini red"
							style={{
								width: "50px",
								aspectRatio: "1/1",
								boxShadow: "none",
								borderRadius: "20%",
							}}
							onClick={() => {
								if (parseInt(getValues("fridgeName")) > 1)
									setValue(
										"fridgeName",
										(parseInt(getValues("fridgeName")) - 1).toString(),
										{
											shouldValidate: false,
										},
									)
							}}>
							-
						</button>
						<Form.Control
							type="number"
							placeholder={`1~${placeCount.toString()}`}
							{...register("fridgeName", {
								required: "냉장고 번호를 입력해주세요",
							})}
							onChange={(e) => onOverBorderCount(e.target.value)}
							style={{width: "60px", height: "60px", fontSize: "1rem"}}
						/>
						<button
							type="button"
							className="btn-two mini red"
							style={{
								width: "50px",
								aspectRatio: "1/1",
								boxShadow: "none",
								borderRadius: "20%",
							}}
							onClick={() => {
								// if (parseInt(getValues("fridgeName")) < placeCount)
								// 	setValue(
								// 		"fridgeName",
								// 		(parseInt(getValues("fridgeName")) + 1).toString(),
								// 		{
								// 			shouldValidate: false,
								// 			shouldTouch: true,
								// 		},
								// 	)
							}}>
							+
						</button>
					</div>
					{/* {Array.from({length: placeCount}, (_, i) => {
								let a = i + 1
								return (
									<Form.Check
										inline
										type="radio"
										label={
											<h6 style={{width: "1.5rem", textAlign: "center"}}>
												{a}
											</h6>
										}
										{...register("fridgeName", {
											required: "냉장고 번호를 입력해주세요",
										})}
										value={a}
										name="fridgeName"
										id={"fridgeName" + a}
									/>
								)
							})} */}
					{errors.fridgeName?.type === "required" &&
						getValues("fridgeName") === "" && (
							<h6 style={{color: "red"}}>※냉장고 번호를 입력해주세요</h6>
						)}
					<Form.Label
						style={{
							width: "auto",
							marginTop: "10px",
							marginRight: "12px",
						}}>
						<LabelText style={{fontWeight: "800", margin: "0"}}>
							냉장고 층 :
						</LabelText>
					</Form.Label>
					{Array.from({length: 5}, (_, i) => {
						let a = i + 1
						return (
							<Form.Check
								inline
								type="radio"
								label={
									<h6 style={{width: "1.5rem", textAlign: "center"}}>{a}</h6>
								}
								{...register("floor", {required: "냉장고 층을 선택하세요"})}
								value={a}
								name="floor"
								id={"floor" + a}
							/>
						)
					})}
					{/* <Form.Select
							aria-label="floor"
							{...register("floor", {required: true})}>
							{Array.from({length: 5}, (_, i) => (
								<option key={5 - i} value={5 - i}>
									{5 - i}
								</option>
							))}
						</Form.Select> */}
					{errors.floor?.type === "required" && (
						<h6 style={{color: "red"}}>※층을 입력해주세요</h6>
					)}
					{/* <Form.Group style={{marginTop: "10px"}}>
						<p style={{fontWeight: "800"}}> 초음파 가동 시간:</p>
						{Array.from({length: 7}, (_, i) => {
							let a = i
							return (
								<Form.Check
									inline
									type="radio"
									label={
										<h6 style={{width: "1rem", textAlign: "center"}}>{a}</h6>
									}
									{...register("ultraTime")}
									value={a}
									name="ultraTime"
									id={"ultraTime" + a}
									key={a}
								/>
							)
						})}
					</Form.Group> */}
					<div
						style={{
							display: "flex",
							justifyContent: "right",
						}}>
						<Button
							variant="danger"
							type="submit"
							style={{
								width: "157px",
								height: "50px",
							}}>
							적용
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default AgingModal

const LabelText = styled.p`
	font-weight: 800;
	margin: 0;
`
