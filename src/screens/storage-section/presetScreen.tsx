import {Button, ButtonGroup, Stack, ToggleButton} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {useCallback, useEffect, useState} from "react"
import {BeefCuts, PorkCuts} from "../../utils/consts/meat"
import toast, {Toaster} from "react-hot-toast"
import {
	fbCollections,
	sessionKeys,
	xlsxHeaders,
} from "../../utils/consts/constants"
import moment from "moment"
import {backgroundColors} from "../../utils/consts/colors"
import {DatePickerSet} from "../../components/common/datePickerSet"
import {PortraitDiv, StyledHeader} from "../../utils/consts/style"
import useFBFetch from "../../hooks/useFBFetch"
import {limit, orderBy} from "firebase/firestore"
import {MeatInfoWithEntry, XlsxStoreType} from "../../utils/types/meatTypes"
import _ from "lodash"
import * as xlsx from "xlsx"
import {parseToDate} from "../../utils/consts/functions"

export default function PresetScreen() {
	const [date, setDate] = useState(new Date())
	const [time, setTime] = useState(
		// new Date().getHours() >= 12
		//     ? new Date().getHours() - 12:
		new Date().getHours(),
	)
	const [species, setSpecies] = useState("돼지")
	const [cutList, setCutList] = useState<string[]>(PorkCuts)
	const [cut, setCut] = useState("")
	const [amPm, setAmPm] = useState(
		// new Date().getHours() < 12 ? true     :
		false,
	) //true : am , false : pm

	const dateData = {
		date: date,
		setDate: setDate,
		time: time,
		setTime: setTime,
		amPm: amPm,
		setAmPm: setAmPm,
		variant: "primary",
	}
	const session = sessionStorage
	const navigate = useNavigate()

	const goToCameraScreen = () => {
		if (cut === "") {
			toast("부위도 골라주세요")
		} else {
			session.setItem(
				sessionKeys.storageDate,
				moment(date).format("YYYY-MM-DD ") +
					(amPm ? time : time + 12).toString().padStart(2, "0"),
				// date.toLocaleDateString("ko-KR")
			)
			session.setItem(sessionKeys.storageSpecies, species)
			session.setItem(sessionKeys.storageCut, cut)

			navigate("/storage/camera")
		}
	}

	const onSpeciesChanged = (e: any) => {
		setSpecies(e.target.value)
		setCut("")
	}
	const onCutChanged = (e: any) => {
		setCut(e.target.value)
	}

	useEffect(() => {
		let tempDate = session.getItem(sessionKeys.storageDate)
		let tempSpecies = session.getItem(sessionKeys.storageSpecies)
		let tempCut = session.getItem(sessionKeys.storageCut)
		if (tempDate != null && !Number.isNaN(new Date(tempDate).getTime()))
			setDate(new Date(tempDate))
		if (tempSpecies != null) setSpecies(tempSpecies)
		if (tempCut != null) setCut(tempCut)
		session.setItem("scanText", "undefined")

		session.setItem(sessionKeys.storageItems, "")
	}, [])

	useEffect(() => {
		if (species === "소") {
			setCutList(BeefCuts)
		} else {
			setCutList(PorkCuts)
		}
	}, [species])

	const {data, loading, refetch} = useFBFetch<MeatInfoWithEntry>(
		fbCollections.sp2Storage,
		[],
		orderBy("uploadTime"),
		limit(40),
	)

	const [xlsxData, setXlsxData] = useState<XlsxStoreType[]>([])

	const writeXlsx = () => {
		console.log("write", xlsxData)
		const book = xlsx.utils.book_new()
		const xlsxLetsgo = xlsx.utils.json_to_sheet(xlsxData, {
			header: xlsxHeaders,
		})
		xlsx.utils.book_append_sheet(book, xlsxLetsgo, "StoreSheet")
		xlsx.writeFile(book, " storage.xlsx")
	}
	const write = useCallback(_.debounce(writeXlsx, 2000), [xlsxData])

	useEffect(() => {
		const max = data
			.filter((item) => "uploadTime" in item)
			.sort((a, b) =>
				a.uploadTime && b.uploadTime
					? b.uploadTime - a.uploadTime
					: parseToDate(b.storedDate).getTime() -
					  parseToDate(a.storedDate).getTime(),
			)[0]?.uploadTime
		console.log(max)

		var list: XlsxStoreType[] = data
			.filter((item) => "uploadTime" in item)
			.sort((a, b) =>
				a.uploadTime && b.uploadTime
					? b.uploadTime - a.uploadTime
					: parseToDate(b.storedDate).getTime() -
					  parseToDate(a.storedDate).getTime(),
			)
			.filter(
				(item) =>
					typeof item.uploadTime === "number" &&
					typeof max === "number" &&
					new Date(item.uploadTime!).getDate() === new Date(max!).getDate(),
			)
			.sort(
				(a, b) =>
					parseInt(a.entry.split("/")[0]) - parseInt(b.entry.split("/")[0]),
			)
			.map((item) => {
				return {
					입고일: item.storedDate,
					이력번호: item.meatNumber!!,
					순번: item.entry,
					육종: item.species,
					원산지: item.origin!!,
					암수: item.gender!!,
					등급: item.grade!!,
					부위: item.cut,
					보관: item.freeze!!,
					단가: item.price!!,
				}
			})

		setXlsxData(list)
	}, [data])

	return (
		<PortraitDiv bgcolor={backgroundColors.storage_back} padding="30px 10px">
			<Toaster position="top-center" reverseOrder={false} />
			<StyledHeader>
				<Button
					style={{width: "20%"}}
					variant="primary"
					onClick={() => navigate("../")}>
					뒤로
				</Button>

				<h2
					style={{
						width: "50%",
						textAlign: "center",
					}}>
					사전 설정
				</h2>
				<Button style={{width: "20%"}} variant="primary" onClick={write}>
					최근
				</Button>
			</StyledHeader>

			<Stack
				gap={1}
				style={{
					width: "100%",
					marginTop: "20px",
					position: "relative",
					backgroundColor: backgroundColors.storage,
					borderRadius: "20px",
					padding: "20px 12px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
				}}>
				<h3>언제 입고되었나요?</h3>

				<DatePickerSet dateData={dateData} />
			</Stack>
			<div
				style={{
					width: "100%",
					marginTop: "20px",
					position: "relative",
					backgroundColor: backgroundColors.storage,
					borderRadius: "20px",
					padding: "12px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
				}}>
				<h3>어떤 고기인가요?</h3>
				<ButtonGroup style={{width: "90%"}}>
					{["돼지", "소"].map((radio, idx) => (
						<ToggleButton
							key={idx}
							id={`species-${idx}`}
							value={radio}
							type="radio"
							checked={radio === species}
							onChange={onSpeciesChanged}
							style={{
								width: "40%",
								fontSize: "1.3rem",
								borderRadius: "0",
							}}>
							{radio}
						</ToggleButton>
					))}
				</ButtonGroup>
				<ButtonGroup
					vertical={true}
					defaultValue={""}
					size="sm"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						padding: "0 10px 0 10px",
					}}>
					{cutList.map((radio, idx) => (
						<ToggleButton
							key={idx}
							id={`cut-${idx}`}
							value={radio}
							type="radio"
							variant={radio === cut ? "primary" : "outline-primary"}
							checked={radio === cut}
							onChange={onCutChanged}
							style={{
								fontSize: "1.3rem",
								// color: fontColors.storage,
								// backgroundColor: "white",
							}}>
							{radio}
						</ToggleButton>
					))}
				</ButtonGroup>
			</div>
			<div style={{height: "4px"}}></div>
			<Button
				style={{
					width: "70%",
					height: "3rem",
					fontSize: "1.2rem",
				}}
				variant="primary"
				onClick={goToCameraScreen}>
				다음
			</Button>
		</PortraitDiv>
	)
}
