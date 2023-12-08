import {
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
} from "firebase/firestore"
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

// export async function getRecordPages(
//     setRecords: React.Dispatch<React.SetStateAction<MeatInfoAiO[]>>
// ) {
//     const getQuery = query(
//         dbRecord,
//         orderBy("storedDate"),
//         orderBy("agingDate"),
//         orderBy("finishDate"),
//         limit(2)
//     )
//     const result = await getDocs(getQuery)
//     var records: MeatInfoAiO[] = []
//     result.forEach((doc: DocumentData) => {
//         let datum: MeatInfoAiO = doc.data()
//         let data = { ...datum, docId: doc.id }
//         records.push(data)
//     })
//     console.log(result.docs)

//     setRecords(records)
// }
