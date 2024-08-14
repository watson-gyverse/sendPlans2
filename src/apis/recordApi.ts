import {DocumentData, doc, getDocs, writeBatch} from "firebase/firestore"
import {fbCollections} from "../utils/consts/constants"
import {getCollection} from "../utils/consts/functions"
import {MeatInfoAiO} from "../utils/types/meatTypes"
import {firestoreDB} from "../utils/Firebase"

const dbRecord = getCollection(fbCollections.sp2Record)
export async function getRecords(
	setRecords: React.Dispatch<React.SetStateAction<MeatInfoAiO[]>>,
) {
	const result = await getDocs(dbRecord)
	var records: MeatInfoAiO[] = []
	result.forEach((doc: DocumentData) => {
		let datum: MeatInfoAiO = doc.data()
		let data = {...datum, docId: doc.id}
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
export async function addUsername(user: string) {
	const batch = writeBatch(firestoreDB)
	const collection = fbCollections.sp2Order
	const snapshot = await getDocs(getCollection(collection))
	snapshot.forEach((docu) => {
		const docRef = doc(firestoreDB, `${collection}/${docu.id}`)
		batch.update(docRef, {
			user: user,
		})
	})
	await batch.commit()
}
