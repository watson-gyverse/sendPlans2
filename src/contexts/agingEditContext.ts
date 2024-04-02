import {MeatInfoAiO, MeatInfoWithEntry} from "../utils/types/meatTypes"

export type AgingEditContextType = {
	isEditMode: boolean
	setEditMode: (isEditMode: boolean) => void
	recentMeatInfo: MeatInfoAiO | undefined
	setRecentMeatInfo: (meatInfo: MeatInfoAiO) => void
	setModalShow: (showModal: boolean) => void
	fetch: () => void
	onClickStartAging: (meatInfo: MeatInfoWithEntry) => Promise<void>
	checkedSList: string[]
	setCheckedSList: (list: string[]) => void
}
