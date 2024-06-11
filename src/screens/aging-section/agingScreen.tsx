import {where} from "firebase/firestore"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import {
	AgingCardsTab,
	AgingFinishCard,
} from "../../components/aging-section/agingFinishCard"
import {useEffect, useState} from "react"
import {deleteFromAgingFridge} from "../../apis/agingApi"
import FinishAgingModal from "../../components/aging-section/agingFinishModal"
import toast, {Toaster} from "react-hot-toast"
import {Stack} from "react-bootstrap"
import {useLocation} from "react-router-dom"
import _ from "lodash"
import {sortArray} from "../../utils/consts/functions"

interface IAgingScreen {
	place: string
	isEditMode: boolean
}

export const AgingScreen = (props: IAgingScreen) => {
	const location = useLocation()
	const mn = new URLSearchParams(location.search).get("mn")
	const cut = new URLSearchParams(location.search).get("cut")
	const [isInitialized, setIsInitialized] = useState(false)
	const {data, refetch} = useFBFetch<MeatInfoAiO>(
		fbCollections.sp2Aging,
		mn && cut
			? [
					where("cut", "==", cut),
					where("meatNumber", "==", mn),
					where("place", "==", props.place),
			  ]
			: [where("place", "==", props.place)],
	)
	const [agingItems, setAgingItems] = useState<MeatInfoAiO[][]>()
	const [recentItem, setRecentItem] = useState<MeatInfoAiO>()

	const [finishModalShow, setFinishModalShow] = useState(false)

	const onClickAgingDeleteButton = (item: MeatInfoAiO) => {
		const ok = window.confirm("숙성 중인 아이템입니다. 정말 삭제하시겠습니까?")
		if (ok) {
			deleteFromAgingFridge(item.docId!!, () => {
				toast.success("삭제완료")
			}).then(refetch)
		}
	}

	const onAgingFinished = async () => {
		setFinishModalShow(false)
		refetch()
	}

	useEffect(() => {
		if (data.length === 0 && mn !== null && cut !== null && isInitialized) {
			toast("숙성 중인 것도 없네요")
		} else if (
			data.length !== 0 &&
			mn !== null &&
			cut !== null &&
			isInitialized
		) {
			toast("입고 상태인 항목이 없어\n숙성 중 탭으로 이동했습니다")
		}
		setIsInitialized(true)

		let init: {[index: string]: Array<MeatInfoAiO>} = {}
		const reducedA = data.reduce((acc, cur) => {
			let key = cur.meatNumber + cur.cut
			acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
			return acc
		}, init)
		const converted = sortArray(Object.values(reducedA), [
			(item) => item.storedDate,
			(item) => item.agingDate,
		])
		setAgingItems([...converted])
	}, [data])

	// function sortArray(oArray: MeatInfoAiO[][]): MeatInfoAiO[][] {
	// 	const newArray: MeatInfoAiO[][] = []
	// 	oArray.forEach((array) => {
	// 		const converted = _.sortBy(array,[ (item) => item.storedDate,(item=>item.agingDate)])

	// 		newArray.push(converted)
	// 	})
	// 	return newArray
	// }

	useEffect(() => {
		console.log(agingItems)
	}, [agingItems])

	const handleClickEvent = (item: MeatInfoAiO) => {
		setRecentItem(item)
		setFinishModalShow(true)
	}
	const handleClickDelete = (item: MeatInfoAiO) => {
		onClickAgingDeleteButton(item)
	}

	return (
		<Stack gap={2}>
			<Toaster />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}>
				{agingItems &&
					agingItems.map((items) => (
						// items.map((item) => <h1>{item.cut}</h1>),
						<AgingCardsTab
							data={items}
							isEditMode={props.isEditMode}
							clickEvent={handleClickEvent}
							onClickDelete={handleClickDelete}
						/>
					))}
			</div>

			{recentItem && finishModalShow && (
				<FinishAgingModal
					meatInfo={recentItem}
					finishAgingEvent={() => {
						onAgingFinished()
					}}
					show={finishModalShow}
					setShow={setFinishModalShow}
				/>
			)}
		</Stack>
	)
}
