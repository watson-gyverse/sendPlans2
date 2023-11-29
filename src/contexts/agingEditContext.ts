import { MeatInfoWithEntry } from "../utils/types/meatTypes"

export type AgingEditContextType = {
    isEditMode: boolean
    setEditMode: (isEditMode: boolean) => void
    recentMeatInfo: MeatInfoWithEntry | undefined
    setRecentMeatInfo: (meatInfo: MeatInfoWithEntry) => void
    setModalShow: (showModal: boolean) => void
    fetch: () => void
    onClickStartAging: (meatInfo: MeatInfoWithEntry) => Promise<void>
}
