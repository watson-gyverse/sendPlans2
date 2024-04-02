import {useEffect, useState} from "react"
import {Button, FloatingLabel, Form, Modal, Stack} from "react-bootstrap"
import {finishAging, updateSave} from "../../apis/agingApi"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import moment from "moment"
import {DatePickerSet} from "../common/datePickerSet"
import {isNullOrNanOrUndefined} from "../../utils/consts/functions"
import toast, {Toaster} from "react-hot-toast"

type FinishAgingParams = {
	meatInfo: MeatInfoAiO
	finishAgingEvent: () => void
	show: boolean
	setShow: (show: boolean) => void
}

export default function FinishAgingModal(props: FinishAgingParams) {
	const {meatInfo, finishAgingEvent, show, setShow} = props

	const [date, setDate] = useState<Date>(new Date())
	const [time, setTime] = useState<number>(date.getHours())
	const [amPm, setAmPm] = useState(time < 12) //true : am , false : pm

	const [cdate, setCDate] = useState<Date>(new Date())
	const [ctime, setCTime] = useState<number>(cdate.getHours())
	const [camPm, setCAmPm] = useState(ctime < 12) //true : am , false : pm
	const [afterWeight, setAfterWeight] = useState<number | null>(null)
	const [cutWeight, setCutWeight] = useState<number | null>(null)

	useEffect(() => {
		if (meatInfo.afterWeight) {
			setAfterWeight(meatInfo.afterWeight)
		}
		if (meatInfo.cutWeight) {
			setCutWeight(meatInfo.cutWeight)
		}
		if (meatInfo.finishDate) {
			setDate(new Date(meatInfo.finishDate.split(" ")[0]))
		}
		if (meatInfo.cutDate) {
			setCDate(new Date(meatInfo.cutDate.split(" ")[0]))
		}
	}, [meatInfo])

	const reset = () => {
		// setAfterWeight(null)
		// setCutWeight(null)
		// setDate(new Date())
		// setCDate(new Date())
	}

	const dateData = {
		date: date,
		setDate: setDate,
		time: time,
		setTime: setTime,
		amPm: amPm,
		setAmPm: setAmPm,
		variant: "danger",
	}
	const cdateData = {
		date: cdate,
		setDate: setCDate,
		time: ctime,
		setTime: setCTime,
		amPm: camPm,
		setAmPm: setCAmPm,
		variant: "danger",
	}
	const onSubmit = () => {
		const ok = window.confirm("정말 숙성 종료합니다?")
		if (ok) {
			let aIO: MeatInfoAiO = {
				...meatInfo,
				finishDate:
					moment(date).format("YYYY-MM-DD ") + time.toString().padStart(2, "0"),
				afterWeight: afterWeight!!,
				cutWeight: cutWeight!!,
				cutDate:
					moment(cdate).format("YYYY-MM-DD ") +
					time.toString().padStart(2, "0"),
			}
			finishAging(aIO, async () => {
				finishAgingEvent()
				setShow(false)
				toast.success("종료했습니다")
			})
		}
	}

	const onSaveClick = () => {
		const save: MeatInfoAiO = {
			...meatInfo,
			finishDate:
				moment(date).format("YYYY-MM-DD ") + time.toString().padStart(2, "0"),
			cutDate:
				moment(cdate).format("YYYY-MM-DD ") + time.toString().padStart(2, "0"),
			cutWeight: cutWeight,
			afterWeight: afterWeight,
		}
		console.log(save)
		updateSave(save.docId, save, async () => {
			console.log("update done")
			finishAgingEvent()
			setShow(false)
			toast.success("저장했습니다")
		})
	}

	useEffect(() => {
		console.log(`${afterWeight} ${cutWeight}`)
	}, [afterWeight, cutWeight])

	return (
		<Modal
			show={show}
			onHide={() => {
				reset()
				setShow(false)
			}}>
			<Toaster />
			<Modal.Header closeButton>
				<Modal.Title>숙성 완료</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group style={{marginTop: "10px", marginBottom: "10px"}}>
						<Stack gap={2}>
							<h6>숙성 종료 시각</h6>
							<DatePickerSet dateData={dateData} />
							<FloatingLabel label="숙성 후 무게(g)">
								<Form.Control
									type="number"
									placeholder="AfterWeight"
									value={afterWeight ? afterWeight : ""}
									onChange={(e) => setAfterWeight(Number(e.target.value))}
								/>
							</FloatingLabel>
							<h6>손질 시각</h6>
							<DatePickerSet dateData={cdateData} />

							<FloatingLabel label="손질 후 무게(g)">
								<Form.Control
									type="number"
									placeholder="CutWeight"
									value={cutWeight ? cutWeight : ""}
									onChange={(e) => setCutWeight(Number(e.target.value))}
								/>
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
							onClick={onSubmit}
							disabled={
								isNullOrNanOrUndefined(afterWeight) ||
								isNullOrNanOrUndefined(cutWeight) ||
								afterWeight === 0 ||
								cutWeight === 0
							}
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
