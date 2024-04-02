/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from "react"
import {backgroundColors} from "../../utils/consts/colors"
import {ConsignTable} from "./table"
import {
	ConsignCsvData,
	ConsignData,
	ConsignItem,
} from "../../utils/types/otherTypes"
import AddModal from "../../components/consign-section/addModal"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {where} from "firebase/firestore"
import {Toaster} from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import styled from "styled-components"
import * as xlsx from "xlsx"
import {padNumber} from "../../utils/consts/functions"
import {CSVLink} from "react-csv"
import moment from "moment"
import Link from "react-csv/components/Link"
const headers = [
	{label: "일련번호", key: "id"},
	{label: "위탁사", key: "client"},
	{label: "이력번호", key: "meatNumber"},
	{label: "부위", key: "cut"},
	{label: "숙성전무게", key: "initWeight"},
	{label: "숙성시작일", key: "initDate"},
	{label: "숙성후무게", key: "afterWeight"},
	{label: "숙성종료일", key: "afterDate"},
	{label: "손질후무게", key: "cutWeight"},
	{label: "손질한날짜", key: "cutDate"},
	{label: "덩이별무게", key: "itemWeight"},
]
export const ConsignScreen = () => {
	const navigate = useNavigate()
	const [client, setClient] = useState("")
	const [meatNumber, setMeatNumber] = useState("")
	const [isL, setL] = useState(false)
	const [canAddModalShow, setCanAddModalShow] = useState(false)
	const [addModalShow, setAddModalShow] = useState(false)

	const {data, refetch} = useFBFetch<ConsignData>(
		fbCollections.sp2Consign,
		where("client", "==", client),
	)
	const [csvData, setCsvData] = useState<ConsignCsvData[]>([])
	useEffect(() => {
		console.log(data)
		const newData: ConsignCsvData[] = []
		data.forEach((datum) => {
			datum.items.forEach((item, index) => {
				const xlsxDatum: ConsignCsvData = {
					id: padNumber(datum.id, 3) + "_" + padNumber(index, 2),
					client: datum.client,
					meatNumber: datum.meatNumber,
					cut: datum.cut,
					initWeight: datum.initWeight,
					initDate: datum.initDate,
					afterWeight: anywayFill(datum.afterWeight),
					afterDate: anywayFill(datum.afterDate),
					cutWeight: anywayFill(datum.cutWeight),
					cutDate: anywayFill(datum.cutDate),
					itemWeight: item.weight,
				}
				newData.push(xlsxDatum)
			})
		})
		setCsvData(newData)
		console.log("xlsxData: ")
		console.log(newData)
	}, [data])

	const onSearchClient = () => {
		console.log(`검색 ${client}`)
		refetch()
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
		setCanAddModalShow(client.length > 1 && meatNumber.length >= 12)
	}, [meatNumber, client])

	useEffect(() => {
		if (!addModalShow) {
			refetch()
		}
	}, [addModalShow])

	const onBackClick = () => {
		navigate("../")
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: backgroundColors.consign,
				borderRadius: "20px",
				padding: "20px 10px",
			}}>
			<Toaster />

			{/* 위탁사 검색 */}
			<MenuDiv>
				<button style={{width: "60px"}} onClick={onBackClick}>
					뒤로
				</button>
				<input
					style={{width: "12rem"}}
					type="text"
					id="clientInput"
					placeholder="위탁사 명"
					onChange={(e) => setClient(e.target.value)}
				/>
				<button onClick={onSearchClient}>조회</button>
			</MenuDiv>
			<MenuDiv>
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
				/>{" "}
				<button
					style={{width: "3rem"}}
					disabled={!canAddModalShow}
					onClick={onAddButtonClick}>
					+
				</button>
				<div style={{marginLeft: "1rem"}}>
					{csvData.length > 1 ? (
						<CSVLink
							headers={headers}
							data={csvData}
							filename={`${client}_${moment().format("YYYYMMDD")}.csv`}>
							csv
						</CSVLink>
					) : (
						<></>
					)}
				</div>
			</MenuDiv>

			<ConsignTable
				data={data.sort((a, b) => (a.id < b.id ? -1 : 0))}
				refetch={refetch}
			/>
			<AddModal
				client={client}
				meatNumber={meatNumber}
				show={addModalShow}
				setShow={setAddModalShow}
			/>
		</div>
	)
}

const MenuDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 4px;
`

function anywayFill(a: any): string {
	return `${a ? a : "-"}`
}

// function makeData(): ConsignData[] {
// 	var a: ConsignData[] = [
// 		{
// 			id: 1,
// 			client: "까매용",
// 			meatNumber: "L111122223333",
// 			cut: "삼겹살",
// 			initWeight: 12.21,
// 			initDate: "2024-03-18 16",
// 			items: [],
// 			afterWeight: 14,
// 			cutWeight: null,
// 		},
// 		{
// 			id: 2,
// 			client: "까매용",
// 			meatNumber: "L342343234323",
// 			cut: "목살",
// 			initWeight: 14.22,
// 			initDate: "2024-03-18 16",
// 			items: [],
// 			afterWeight: 12.21,
// 			cutWeight: 11.11,
// 		},
// 	]
// 	return a
// }
