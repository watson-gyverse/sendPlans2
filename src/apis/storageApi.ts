import {addDoc, collection} from "firebase/firestore"
import {XlsxStoreType} from "../utils/types/meatTypes"
import {fbCollections} from "../utils/consts/constants"
import {firestoreDB} from "../utils/Firebase"

export async function addToFirestore(
	data: XlsxStoreType,
	uploadTime: number,
	thenWhat: () => void,
	catchWhat: () => void,
) {
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
	})
		.then(() => {
			thenWhat()
		})
		.catch(() => {
			catchWhat()
		})
}
