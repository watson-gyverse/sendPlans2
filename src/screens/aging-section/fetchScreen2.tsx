import _ from "lodash"
import {useCallback, useEffect, useState} from "react"
import {Button, ButtonGroup, Stack, ToggleButton} from "react-bootstrap"
import toast, {Toaster} from "react-hot-toast"
import {useLocation, useNavigate} from "react-router-dom"
import * as xlsx from "xlsx"
import {fetchFromFirestore2, passToAgingCollection} from "../../apis/agingApi"
import {NewAgingCard} from "../../components/aging-section/agingEditNewCard"
import AgingModal from "../../components/aging-section/agingModal"
import {AgingEditContextType} from "../../contexts/agingEditContext"
import {backgroundColors} from "../../utils/consts/colors"
import {fbCollections, xlsxAgingHeaders} from "../../utils/consts/constants"
import {sortAgingItems} from "../../utils/consts/functions"
import {MeatInfoWithEntry, XlsxAgingType} from "../../utils/types/meatTypes"
import {AgingScreen} from "./agingScreen"
import useFBFetch from "../../hooks/useFetch"
import {where} from "firebase/firestore"

export const FetchScreen2 = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [placeName, setPlaceName] = useState(
		location.state ? location.state.placeName : "카대",
	)
	const [placeCount, setPlaceCount] = useState(
		location.state ? location.state.placeCount : "4",
	)

	const agingKey = "RecentAging"
	const dateKey = "RecentDate"

	const [isEditMode, setIsEditMode] = useState(false)
	const mn = new URLSearchParams(location.search).get("mn")
	const cut = new URLSearchParams(location.search).get("cut")
	const {data, refetch} = useFBFetch<MeatInfoWithEntry>(
		fbCollections.sp2Storage,
		mn && cut ? [where("cut", "==", cut), where("meatNumber", "==", mn)] : [],
	)
	const [rawItems, setRawItems] = useState<MeatInfoWithEntry[]>([])
	const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[][]>([])
	const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
	const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

	const [checkedSList, setCheckedSList] = useState<string[]>([])
	const [checkedAList, setCheckedAList] = useState<string[]>([])

	const [whichTab, setWhichTab] = useState(true)
	const [editModalShow, setEditModalShow] = useState(false)

	const recentAging = localStorage.getItem(agingKey)
	const lastXlsxDate = localStorage.getItem(dateKey)
	const [xlsxData, setXlsxData] = useState<XlsxAgingType[]>([])

	// useEffect(() => {
	// 	if (location.state !== null) setPlaceName(location.state.placeName)
	// 	else {
	// 		const ok = window.confirm("장소를 카대로 하시겠습니까? 취소: 매장")
	// 		setPlaceName(ok ? "카대" : "매장")
	// 		if (location.state !== null) setPlaceCount(location.state.placeCount)
	// 		else {
	// 			setPlaceCount(ok ? "4" : "2")
	// 		}
	// 	}
	// }, [])
	useEffect(() => {
		if (data.length === 0 && mn !== null) {
			setWhichTab(false)
		}
		setRawItems(data)
	}, [data])

	useEffect(() => {
		refetch()
	}, [mn, cut])

	function fetch() {
		fetchFromFirestore2(
			setRawItems,
			setAgingItems,
			placeName,
			() => {
				console.log("fetch complete")
			},
			() => {
				console.error("fetch failed")
			},
		)
	}

	const onClickStartAging = async (item: MeatInfoWithEntry) => {
		const ok = window.confirm(
			"이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다.",
		)
		if (ok) {
			makeXlsx([item])
			await startAging(item)
			//이거 다음에 write
		}
	}

	const agingEditProps: AgingEditContextType = {
		isEditMode: isEditMode,
		setEditMode: setIsEditMode,
		recentMeatInfo: recentMeatInfo,
		setRecentMeatInfo: setRecentMeatInfo,
		setModalShow: setEditModalShow,
		fetch: fetch,
		onClickStartAging: onClickStartAging,
		checkedSList: checkedSList,
		setCheckedSList: setCheckedSList,
	}

	//true null없음
	const checkNullCheckedS = () => {
		if (checkedSList.length === 0) {
			return false
		}
		let isClean = true
		checkedSList.forEach((item) => {
			let it = _.find(rawItems, {docId: item})
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

	useEffect(() => {
		console.log("INITIAL LOAD")
		// fetch()
		setRawItems(data)
		console.log("mn: " + mn)
		console.log("cut: " + cut)

		console.log(recentAging)
		if (recentAging !== null && recentAging !== "") {
			const data: XlsxAgingType[] = JSON.parse(recentAging)
			if (!_.some(data, _.isUndefined)) {
				console.log(data)
				setXlsxData(data)
			}
		}
	}, [])

	useEffect(() => {
		let init: {[index: string]: Array<MeatInfoWithEntry>} = {}
		const reducedS = rawItems.reduce((acc, cur) => {
			let key = cur.meatNumber + cur.storedDate + cur.cut
			acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
			return acc
		}, init)
		const converted = sortArray(Object.values(reducedS))
		setStoredItems([...converted])
	}, [rawItems])

	useEffect(() => {
		if (recentMeatInfo === undefined) return
		let tempList = [...rawItems].filter((item) => {
			if (
				item.meatNumber !== recentMeatInfo.meatNumber ||
				(item.meatNumber === recentMeatInfo.meatNumber &&
					item.entry !== recentMeatInfo.entry)
			) {
				return true
			}
		})
		tempList.push(recentMeatInfo)
		const sorted = sortAgingItems(tempList)
		setRawItems(sorted)
	}, [recentMeatInfo])

	function sortArray(oArray: MeatInfoWithEntry[][]): MeatInfoWithEntry[][] {
		const newArray: MeatInfoWithEntry[][] = []
		oArray.forEach((array) => {
			const converted = _.sortBy(array, (item) => item.entry.split("/")[0])
			console.log(converted)
			newArray.push(converted)
		})
		return newArray
	}

	useEffect(() => {
		console.log(whichTab)
	}, [whichTab])

	const onClickBack = () => {
		navigate("../")
	}

	const onClickStartAgingSelected = useCallback(async () => {
		const ok = window.confirm("선택한 아이템을 모두 숙성시작시킵니다.")
		if (ok) {
			let list: MeatInfoWithEntry[] = []
			checkedSList.forEach(async (item) => {
				const a = _.find(rawItems, {docId: item})
				if (a) {
					list.push(a)
				}
			})
			console.log("SELECTED AGING")
			console.log(list)
			makeXlsx(list)
			list.forEach(async (item) => {
				await startAging(item)
			})
		}
	}, [checkedSList])

	async function startAging(item: MeatInfoWithEntry) {
		await passToAgingCollection(item)
		refetch()
		// await fetchFromFirestore2(
		// 	setRawItems,
		// 	setAgingItems,
		// 	placeName,
		// 	() => {
		// 		console.log("success and fetch")
		// 		fetch()
		// 		toast.success("숙성시작")
		// 	},
		// 	() => {
		// 		console.log("error !@")
		// 	},
		// )
	}

	const makeXlsx = (items: MeatInfoWithEntry[]) => {
		let xlsxs: XlsxAgingType[] = []
		items.map((item) => {
			let dataRow: XlsxAgingType = {
				입고일: item.storedDate,
				숙성시작일: item.agingDate!!,
				숙성전무게: String(item.beforeWeight),
				냉장고번호: item.fridgeName!!,
				냉장고층: String(item.floor),
				초음파: String(item.ultraTime) + "h",
				이력번호: item.meatNumber!!,
				순번: item.entry,
				육종: item.species,
				원산지: item.origin!!,
				암수: item.gender!!,
				등급: item.grade!!,
				부위: item.cut!!,
				보관: item.freeze!!,
				단가: item.price!!,
			}
			xlsxs.push(dataRow)
		})
		setXlsxData(xlsxs)
		const json = JSON.stringify(xlsxs)
		console.log(json)
		const date = new Date()
		localStorage.setItem(agingKey, json)
		localStorage.setItem(dateKey, date.toLocaleString("ko-KR"))
	}

	const writeXlsx = () => {
		console.log(xlsxData)
		const book = xlsx.utils.book_new()
		const xlsxLetsgo = xlsx.utils.json_to_sheet(xlsxData, {
			header: xlsxAgingHeaders,
		})
		xlsx.utils.book_append_sheet(book, xlsxLetsgo, "StoreSheet")
		if (xlsxData.length > 0) {
			const time = `${new Date().getHours()}:${new Date().getMinutes()}`
			xlsx.writeFile(book, xlsxData[0].숙성시작일 + " " + time + " aging.xlsx")
		}
	}
	const write = useCallback(_.debounce(writeXlsx, 2000), [xlsxData])

	const onClickEditModeButton = () => {
		setIsEditMode(!isEditMode)
	}

	const onCheckAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				if (whichTab) {
					const mapped = _.map(rawItems, "docId")
					setCheckedSList(mapped)
				} else {
					const mapped = _.map(agingItems, "docId")
					setCheckedAList(mapped)
				}
			} else {
				whichTab ? setCheckedSList([]) : setCheckedAList([])
			}
		},
		[whichTab ? storedItems : agingItems],
	)

	return (
		<div
			style={{
				backgroundColor: backgroundColors.aging,
				padding: "20px 10px",

				borderRadius: "20px",
			}}>
			<Toaster />
			{/* 뒤로 매장명 톱니 */}
			<div
				style={{
					display: "flex",
					marginBottom: "12px",
					justifyContent: "space-between",
				}}>
				<Button
					style={{width: "60px", height: "50px", padding: "0"}}
					variant="danger"
					onClick={onClickBack}>
					뒤로
				</Button>
				<h2
					style={{
						// border: "2px solid #ff0000",
						borderRadius: "4px",
						marginBottom: "8px",
						color: "white",
						padding: "8px",
						backgroundColor: "#3f2c2c",
						height: "50px",
						width: "157px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						userSelect: "none",
					}}>
					{placeName}
				</h2>
				<div
					style={{
						width: "60px",
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
					}}>
					<Button
						style={{width: "60px", height: "50px", padding: "0"}}
						variant="danger"
						onClick={onClickEditModeButton}>
						폐기
					</Button>
				</div>
			</div>
			{/* 탭 */}
			<div style={{display: "flex", justifyContent: "center"}}>
				<ButtonGroup>
					<ToggleButton
						id="storage"
						className="shadow-none"
						value="storage"
						variant="danger"
						onClick={() => setWhichTab(true)}
						style={{
							display: "flex",
							width: "157px",
							height: "50px",
							backgroundColor: whichTab ? "#ff3d3d" : "",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<p
							style={{
								color: "white",
								margin: "0",
							}}>
							입고중
						</p>
					</ToggleButton>
					<ToggleButton
						id="aging"
						className="shadow-none"
						value="aging"
						variant="danger"
						onClick={() => setWhichTab(false)}
						style={{
							width: "157px",
							height: "50px",
							display: "flex",
							backgroundColor: whichTab ? "" : "#ff3d3d",
							alignItems: "center",
							justifyContent: "center",
						}}>
						<p
							style={{
								color: "white",
								margin: "0",
							}}>
							숙성중
						</p>
					</ToggleButton>
				</ButtonGroup>
			</div>
			{whichTab ? (
				<Stack gap={2}>
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
								checked={checkedSList.length === rawItems.length}
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
							onClick={onClickStartAgingSelected}
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
							onClick={write}>
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

					{storedItems.map((list) => {
						return (
							<NewAgingCard
								key={"storedCard" + list[0].docId}
								items={list}
								agingEditProps={agingEditProps}
							/>
						)
					})}
				</Stack>
			) : (
				<Stack gap={2}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-around",
							marginTop: "10px",
						}}>
						<AgingScreen place={placeName} isEditMode={isEditMode} />
					</div>
				</Stack>
			)}

			{recentMeatInfo !== undefined ? (
				<AgingModal
					meatInfo={recentMeatInfo}
					placeName={placeName}
					placeCount={parseInt(placeCount)}
					setMeatInfo={setRecentMeatInfo}
					setClose={() => setEditModalShow(false)}
					show={editModalShow}
					setShow={setEditModalShow}
				/>
			) : (
				<></>
			)}
		</div>
	)
}
