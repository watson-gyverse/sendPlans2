import {where} from "firebase/firestore"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import {AgingFinishCard} from "../../components/aging-section/agingFinishCard"
import {useState} from "react"
import {deleteFromAgingFridge} from "../../apis/agingApi"
import FinishAgingModal from "../../components/aging-section/agingFinishModal"
import toast, {Toaster} from "react-hot-toast"
import {Stack} from "react-bootstrap"

interface IAgingScreen {
	place: string
	isEditMode: boolean
}

export const AgingScreen = (props: IAgingScreen) => {
	const {data, refetch} = useFBFetch<MeatInfoAiO>(fbCollections.sp2Aging, [
		where("place", "==", props.place),
	])
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
	return (
		<Stack gap={2}>
			<Toaster />
			{data.map((item) => {
				return (
					<div key={item.docId}>
						<div
							style={{
								width: "100%",
							}}>
							<AgingFinishCard
								meatInfo={item}
								isEditMode={props.isEditMode}
								clickEvent={() => {
									setRecentItem(item)
									setFinishModalShow(true)
								}}
								onClickDelete={() => onClickAgingDeleteButton(item)}
							/>
						</div>
					</div>
				)
			})}
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
