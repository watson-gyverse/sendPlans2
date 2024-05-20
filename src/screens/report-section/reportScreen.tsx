import {useState} from "react"
import {Button, ButtonGroup, Dropdown, ToggleButton} from "react-bootstrap"
import {backgroundColors} from "../../utils/consts/colors"
import {addDoc, collection} from "firebase/firestore"
import {firestoreDB} from "../../utils/Firebase"
import {fbCollections} from "../../utils/consts/constants"
import toast, {Toaster} from "react-hot-toast"
import emailjs from "@emailjs/browser"
import {p_key, service_id, templete_id} from "../../utils/consts/email"
import {useNavigate} from "react-router-dom"
const ReportScreen = () => {
	const navigate = useNavigate()
	const [checkedRadio, setCheckedRadio] = useState("입고")
	const [description, setDesc] = useState("")
	const radios = [
		{name: "입고", value: "입고"},
		{name: "숙성", value: "숙성"},
		{name: "조회", value: "조회"},
		{name: "기타", value: "기타"},
	]

	async function onSendClick() {
		await addDoc(collection(firestoreDB, fbCollections.sp2Report), {
			category: checkedRadio,
			description: description,
		})
			.then(() => {
				toast.success("제보 완료")
				setDesc("")
				emailjs.send(
					service_id,
					templete_id,
					{
						category: checkedRadio,
						description: description,
					},
					p_key,
				)
			})
			.catch(() => {
				toast.error("지금은 안되나봐요")
			})
	}
	const goToPreset = () => {
		navigate("../")
	}
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: backgroundColors.report,
				padding: "20px 10px",
			}}>
			<Toaster />
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-evenly",
						marginBottom: "30px",
					}}>
					<Button
						style={{width: "60px", height: "40px"}}
						variant="success"
						onClick={goToPreset}>
						뒤로
					</Button>
					<h1 style={{margin: "0"}}>버그제보</h1>
					<div style={{width: "60px", height: "40px", margin: "9px"}}></div>
				</div>
				<h2>카테고리</h2>
				<ButtonGroup
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						width: "70%",
						marginBottom: "10px",
					}}>
					{radios.map((radio, idx) => (
						<ToggleButton
							style={{width: "0px"}}
							id={`radio ${idx}`}
							type="checkbox"
							value={radio.value}
							checked={checkedRadio === radio.value}
							onChange={(e) => setCheckedRadio(e.currentTarget.value)}
							variant="success">
							{radio.name}
						</ToggleButton>
					))}
				</ButtonGroup>
				<label htmlFor="description">
					<h5 style={{margin: "0"}}>내용</h5>
				</label>
				<textarea
					style={{width: "80%", height: "400px"}}
					name="description"
					value={description}
					onChange={(e) => setDesc(e.target.value)}
				/>
				<div style={{height: "12px"}}></div>
				<Button
					style={{width: "200px", height: "100px"}}
					variant="success"
					onClick={onSendClick}>
					발송
				</Button>
			</div>
		</div>
	)
}

export default ReportScreen
