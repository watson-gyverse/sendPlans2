import { DocumentData, getDocs } from "firebase/firestore"
import { fbCollections } from "../utils/consts/constants"
import { getCollection } from "../utils/consts/functions"
import { MeatInfoAiO } from "../utils/types/meatTypes"

const dbRecord = getCollection(fbCollections.sp2Record)
export async function getRecords(
    setRecords: React.Dispatch<React.SetStateAction<MeatInfoAiO[]>>
) {
    const result = await getDocs(dbRecord)
    var records: MeatInfoAiO[] = []
    result.forEach((doc: DocumentData) => {
        let datum: MeatInfoAiO = doc.data()
        let data = { ...datum, docId: doc.id }
        records.push(data)
    })
    console.log(records)
    setRecords(records)
}
