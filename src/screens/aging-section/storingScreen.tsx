/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useState} from "react"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {
	MeatInfoAiO,
	MeatInfoWithEntry,
	XlsxAgingType,
} from "../../utils/types/meatTypes"
import _ from "lodash"
import {NewAgingCard} from "../../components/aging-section/agingEditNewCard"
import {AgingEditContextType} from "../../contexts/agingEditContext"
import {Button} from "react-bootstrap"
import {agingXlsxBuilder} from "../../utils/consts/xlsx"
import AgingModal from "../../components/aging-section/agingModal"
import {useLocation} from "react-router-dom"

interface IStoringScreen {
	placeName: string
	placeCount: string
}
export const StoringScreen = (props: IStoringScreen) => {
	const {placeName, placeCount} = props
	const {data, refetch} = useFBFetch<MeatInfoAiO>(fbCollections.sp2Storage)
	const [s_data, setSData] = useState<MeatInfoAiO[][]>([])

	const recentAging = localStorage.getItem("RecentAging")
	const lastXlsxDate = localStorage.getItem("RecentDate")
	const [xlsxData, setXlsxData] = useState<XlsxAgingType[]>([])

	const [isEditMode, setIsEditMode] = useState(false)
	const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoAiO>()
	const [checkedSList, setCheckedSList] = useState<string[]>([])

	const [isModalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		console.log("Storing Screen INITIAL LOAD")
		console.log(recentAging)
		if (recentAging && recentAging !== "") {
			const recentData: XlsxAgingType[] = JSON.parse(recentAging)
			if (!_.some(recentData, _.isUndefined)) {
				setXlsxData(recentData)
			}
		}
	}, [])

	//모두 선택 체크박스
	const onCheckAll = useCallback((checked: boolean) => {
		console.log("ca", checked)

		if (checked) {
			const mapped = _.map(data, "docId")
			setCheckedSList(mapped)
		} else {
			setCheckedSList([])
		}
	}, [])

	//덩이 별로 쪼개기
	useEffect(() => {
		let init: {[index: string]: Array<MeatInfoAiO>} = {}
		const reducedS = data.reduce((acc, cur) => {
			let key = cur.meatNumber + cur.storedDate + cur.cut
			acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
			return acc
		}, init)
		const converted = sortArray(Object.values(reducedS))
		setSData([...converted])
	}, [data])

	const onStartAgingClick = async () => {}

	const onStartAgingSelectedClick = useCallback(async () => {
		const ok = window.confirm("선택한 아이템을 모두 숙성시작시킵니다.")
		if (ok) {
			let list: MeatInfoWithEntry[] = []
			checkedSList.forEach(async (item) => {
				const a = _.find(data, {docId: item})
				if (a) {
					list.push(a)
				}
			})
			console.log("SELECTED AGING")
			console.log(list)
			onXlsxExportClick(list)
			list.forEach(async (item) => {
				// await startAging(item)
			})
		}
	}, [checkedSList])

	const onXlsxExportClick = useCallback(_.debounce(agingXlsxBuilder, 2000), [
		data,
	])

	//true null없음
	const checkNullCheckedS = () => {
		if (checkedSList.length === 0) {
			return false
		}
		let isClean = true
		checkedSList.forEach((item) => {
			let it = _.find(data, {docId: item})
			if (it !== undefined) {
				if (
					it.agingDate === null ||
					it.beforeWeight === null ||
					it.fridgeName === null ||
					it.floor === null
				) {
					isClean = false
				} else {
					console.log("null 없음")
				}
			}
		})
		return isClean
	}
	//카드로 보내는 props
	const agingEditProps: AgingEditContextType = {
		isEditMode: isEditMode,
		setEditMode: setIsEditMode,
		recentMeatInfo: recentMeatInfo,
		setRecentMeatInfo: setRecentMeatInfo,
		setModalShow: setModalOpen,
		fetch: refetch,
		onClickStartAging: onStartAgingClick,
		checkedSList: checkedSList,
		setCheckedSList: setCheckedSList,
	}
	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginTop: "10px",
				}}>
				<div style={{display: "flex"}}>
					<input
						type="checkbox"
						id="selectSAll"
						onChange={(e) => onCheckAll(e.target.checked)}
						checked={checkedSList.length === data.length}
					/>
					<label
						style={{
							display: "flex",
							marginLeft: "6px",
							height: "4rem",
							backgroundColor: "#bcb7ad",
							borderRadius: "6px",
						}}
						htmlFor="selectSAll">
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: "4px",
								userSelect: "none",
							}}>
							<>전체 선택</>
						</div>
					</label>
				</div>

				<Button
					onClick={onStartAgingSelectedClick}
					disabled={!checkNullCheckedS()}
					style={{
						height: "4rem",
					}}
					variant="danger">
					선택
					<br />
					숙성하기
				</Button>
				<Button
					style={{
						height: "4rem",
						backgroundColor: "#217346",
						border: "none",
					}}
					disabled={recentAging === null || recentAging === ""}
					onClick={() => onXlsxExportClick(data)}>
					최근 숙성
					<br /> 추출
				</Button>
			</div>
			<div style={{display: "flex", justifyContent: "right"}}>
				<h6>
					엑셀 데이터 생성 시각: <br />
					{lastXlsxDate}
				</h6>
			</div>
			{s_data.map((list) => {
				return (
					<NewAgingCard
						key={"storedCard" + list[0].docId}
						items={list}
						agingEditProps={agingEditProps}
					/>
				)
			})}
			{recentMeatInfo && (
				<AgingModal
					meatInfo={recentMeatInfo}
					setMeatInfo={setRecentMeatInfo}
					placeName={placeName}
					placeCount={parseInt(placeCount)}
					setClose={() => setModalOpen(false)}
					show={isModalOpen}
					setShow={setModalOpen}
				/>
			)}
		</>
	)
}

function sortArray(oArray: MeatInfoAiO[][]): MeatInfoAiO[][] {
	const newArray: MeatInfoAiO[][] = []
	oArray.forEach((array) => {
		const converted = _.sortBy(array, (item) => item.entry.split("/")[0])
		console.log(converted)
		newArray.push(converted)
	})
	return newArray
}
