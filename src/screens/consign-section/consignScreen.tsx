import {useEffect, useState} from "react"
import {backgroundColors} from "../../utils/consts/colors"
import {ConsignTable} from "./table"
import {ConsignData} from "../../utils/types/otherTypes"
import AddModal from "../../components/consign-section/addModal"

export const ConsignScreen = () => {
	const [client, setClient] = useState("")
	const [meatNumber, setMeatNumber] = useState("")
	const [isL, setL] = useState(false)
	const [canAddModalShow, setCanAddModalShow] = useState(false)
	const [addModalShow, setAddModalShow] = useState(false)

	const onSearchClient = () => {
		console.log(`검색해와 ${client}`)
	}
	const onLClick = () => {
		setL(!isL)
	}
	const onMeatNumberChange = (e: string) => {
		if (isL) setMeatNumber("L".concat(e))
		else setMeatNumber(e)
	}
	const onAddButtonClick = () => {
		console.log(meatNumber)
		setAddModalShow(true)
	}

	useEffect(() => {
		if (isL) {
			setMeatNumber("L".concat(meatNumber))
		} else {
			setMeatNumber(meatNumber.replace("L", ""))
		}
	}, [isL])

	useEffect(() => {
		setCanAddModalShow(client.length > 1 && meatNumber.length > 12)
	}, [meatNumber, client])

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColors.consign,
				borderRadius: "20px",
				padding: "20px 10px",
			}}>
			{/* 위탁사 검색 */}
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}>
				<input
					style={{width: "10rem"}}
					type="text"
					id="clientInput"
					placeholder="위탁사 명"
					onChange={(e) => setClient(e.target.value)}
				/>
				<button onClick={onSearchClient}>조회</button>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
				}}>
				<button
					onClick={onLClick}
					style={{
						outline: "none",
						backgroundColor: isL ? "#45f4a5" : "#6b8077",
					}}>
					L
				</button>
				<input
					style={{width: "15rem"}}
					type="number"
					placeholder="지금 추가할 이력번호 입력"
					onChange={(e) => onMeatNumberChange(e.target.value)}
				/>
			</div>
			<button disabled={!canAddModalShow} onClick={onAddButtonClick}>
				+
			</button>
			<ConsignTable data={makeData()} />
			<AddModal
				client={client}
				meatNumber={meatNumber}
				show={addModalShow}
				setShow={setAddModalShow}
			/>
		</div>
	)
}
function makeData(): ConsignData[] {
	var a: ConsignData[] = [
		{
			id: 1,
			client: "까매용",
			meatNumber: "L111122223333",
			cut: "삼겹살",
			initWeight: 12.21,
			initDate: "2024-03-18 16",
			items: [],
			afterWeight: 14,
			cutWeight: null,
		},
		{
			id: 2,
			client: "까매용",
			meatNumber: "L342343234323",
			cut: "목살",
			initWeight: 14.22,
			initDate: "2024-03-18 16",
			items: [],
			afterWeight: 12.21,
			cutWeight: 11.11,
		},
	]
	return a
}
