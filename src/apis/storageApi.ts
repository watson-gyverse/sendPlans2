import {addDoc, collection} from "firebase/firestore"
import {XlsxStoreType} from "../utils/types/meatTypes"
import {fbCollections} from "../utils/consts/constants"
import {firestoreDB} from "../utils/Firebase"
import {addUserPropertyToData} from "../utils/consts/functions"

export async function addToFirestore(
	originalData: XlsxStoreType,
	uploadTime: number,
	thenWhat: () => void,
	catchWhat: () => void,
) {
	const data = addUserPropertyToData(originalData)
	await addDoc(collection(firestoreDB, fbCollections.sp2Storage), {
		storedDate: data.입고일,
		species: data.육종,
		cut: data.부위,
		meatNumber: data.이력번호,
		origin: data.원산지,
		gender: data.암수,
		grade: data.등급,
		freeze: data.보관,
		price: data.단가,
		entry: data.순번,
		uploadTime: uploadTime,
		user: data.user,
	})
		.then(() => {
			thenWhat()
		})
		.catch(() => {
			catchWhat()
		})
}
