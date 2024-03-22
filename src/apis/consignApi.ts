import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore"
import {firestoreDB} from "../utils/Firebase"
import {fbCollections} from "../utils/consts/constants"
import {ConsignData} from "../utils/types/otherTypes"

export async function addToFirestore(
	data: ConsignData,
	thenWhat: () => void,
	catchWhat: () => void,
) {
	await addDoc(collection(firestoreDB, fbCollections.sp2Consign), {
		id: data.id,
		client: data.client,
		meatNumber: data.meatNumber,
		cut: data.cut,
		initWeight: data.initWeight,
		initDate: data.initDate,
		afterWeight: null,
		cutWeight: null,
		items: [],
	})
		.then(() => {
			thenWhat()
		})
		.catch(() => {
			catchWhat()
		})
}

export async function getClientCount(
	client: string,
	setCount: (c: number) => void,
) {
	const ref = collection(firestoreDB, fbCollections.consignCounter)
	const q = query(ref, where("client", "==", client))

	await getDocs(q).then(async (result) => {
		if (result.empty) {
			console.log(`${client} 레코드없음`)
			await addCountDoc(client)
		} else {
			result.forEach((doc) => {
				setCount(doc.data().value)
			})
		}
	})
}

export async function updateCount(
	client: string,
	value: number,
	setCount: (count: number) => void,
) {
	const ref = collection(firestoreDB, fbCollections.consignCounter)
	const q = query(ref, where("client", "==", client))

	await getDocs(q).then((data) => {
		data.forEach(async (datum) => {
			const id = datum.id
			const ref = doc(firestoreDB, fbCollections.consignCounter, id)
			await updateDoc(ref, {
				client: client,
				value: datum.data().value + 1,
			}).then(() => {
				setCount(datum.data().value + 1)
			})
		})
	})
}

async function addCountDoc(client: string) {
	console.log("없어서 만드는중")
	const ref = doc(collection(firestoreDB, fbCollections.consignCounter))
	await setDoc(ref, {client: client, value: 0}).then(() => {
		console.log("없어서 만들었음")
	})
}

export async function updateExistingItem(
	docId: string,
	data: ConsignData,
	thenWhat: () => void,
) {
	console.log("docId: ", docId)
	console.log("data: ", data)

	const ref = doc(firestoreDB, fbCollections.sp2Consign, docId)
	await updateDoc(ref, {
		afterWeight: data.afterWeight,
		cutWeight: data.cutWeight,
		items: data.items,
	}).then(() => thenWhat())
}
