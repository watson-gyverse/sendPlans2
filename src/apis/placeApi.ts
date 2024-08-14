import {
	DocumentData,
	addDoc,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore"
import {FirestorePlace} from "../utils/types/otherTypes"
import {firestoreDB} from "../utils/Firebase"
import {fbCollections} from "../utils/consts/constants"
import {addUserPropertyToData, getCollection} from "../utils/consts/functions"

const dbPlace = getCollection(fbCollections.sp2Places)
export async function getPlaces(
	setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>,
) {
	const user = localStorage.getItem("email")?.includes("gyverse")
		? "가이버스"
		: localStorage.getItem("email")
	if (!user) return
	const q = query(dbPlace, where("user", "==", user))
	const result = await getDocs(q)
	var places: FirestorePlace[] = []
	result.forEach((doc: DocumentData) => {
		let data: FirestorePlace = {
			id: doc.id,
			name: doc.data().name,
			count: doc.data().count,
		}

		places.push(data)
	})

	setPlaces(places)
}
export async function addPlace(
	placeName: string,
	count: string,
	setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>,
) {
	await addDoc(
		dbPlace,
		addUserPropertyToData({
			name: placeName,
			count: count,
		}),
	)
		.then(() => {
			console.log("추가완료")
			getPlaces(setPlaces)
		})
		.catch(() => {
			console.error("추가실패")
		})
}

export async function deletePlace(
	placeId: string,
	setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>,
) {
	await deleteDoc(doc(firestoreDB, fbCollections.sp2Places, placeId))
		.then(() => {
			console.log("장소 삭제됨")
			getPlaces(setPlaces)
		})
		.catch(() => console.error("장소 삭제실패"))
}
