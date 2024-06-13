import {
	addDoc,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore"
import {MeatInfoAiO, MeatInfoWithEntry} from "../utils/types/meatTypes"
import {firestoreDB} from "../utils/Firebase"
import {fbCollections} from "../utils/consts/constants"
import {getCollection, sortMeatInfoArray} from "../utils/consts/functions"
const dbStorage = getCollection(fbCollections.sp2Storage)
const dbAging = getCollection(fbCollections.sp2Aging)
const dbRecord = getCollection(fbCollections.sp2Record)

export async function fetchFromFirestore(
	setStoredItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
	setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
	place: string,
	thenWhat: () => void,
	catchWhat: () => void,
) {
	//storage
	const sResult = await getDocs(dbStorage)
	var sArray: MeatInfoWithEntry[] = []
	sResult.forEach((doc: any) => {
		let data: MeatInfoWithEntry = doc.data()
		const item: MeatInfoWithEntry = {
			storedDate: data.storedDate,
			species: data.species,
			cut: data.cut,
			meatNumber: data.meatNumber,
			origin: data.origin,
			gender: data.gender,
			grade: data.grade,
			freeze: data.freeze,
			price: data.price,
			entry: data.entry,
			place: place,
			fridgeName: null,
			floor: null,
			beforeWeight: null,
			agingDate: null,
			docId: doc.id,
			ultraTime: null,
			uploadTime: data.uploadTime,
		}
		sArray.push(item)
	})
	//aging
	const aQuery = query(dbAging, where("place", "==", place))
	const aResult = await getDocs(aQuery)
	var aArray: MeatInfoAiO[] = []
	aResult.forEach((doc: any) => {
		let data: MeatInfoAiO = doc.data()
		const item: MeatInfoAiO = {
			storedDate: data.storedDate,
			species: data.species,
			cut: data.cut,
			meatNumber: data.meatNumber,
			origin: data.origin,
			gender: data.gender,
			grade: data.grade,
			freeze: data.freeze,
			price: data.price,
			entry: data.entry,
			place: data.place,
			fridgeName: data.fridgeName,
			floor: data.floor,
			beforeWeight: data.beforeWeight,
			agingDate: data.agingDate,
			docId: doc.id,
			ultraTime: data.ultraTime,
			finishDate: data.finishDate,
			afterWeight: data.afterWeight,
			cutWeight: data.cutWeight,
			cutDate: data.cutDate,
			uploadTime: data.uploadTime,
		}
		aArray.push(item)
	})
	setStoredItems(sortMeatInfoArray(sArray))
	setAgingItems(sortMeatInfoArray(aArray))
}

export async function fetchFromFirestore2(
	setStoredItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
	setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
	place: string,
	thenWhat: () => void,
	catchWhat: () => void,
) {
	try {
		//storage
		const sResult = await getDocs(dbStorage)
		var sArray: MeatInfoWithEntry[] = []
		sResult.forEach((doc: any) => {
			let data: MeatInfoWithEntry = doc.data()
			const item: MeatInfoWithEntry = {
				storedDate: data.storedDate,
				species: data.species,
				cut: data.cut,
				meatNumber: data.meatNumber,
				origin: data.origin,
				gender: data.gender,
				grade: data.grade,
				freeze: data.freeze,
				price: data.price,
				entry: data.entry,
				place: place,
				fridgeName: null,
				floor: null,
				beforeWeight: null,
				agingDate: null,
				docId: doc.id,
				ultraTime: null,
				uploadTime: data.uploadTime,
			}
			sArray.push(item)
		})
		//aging
		const aQuery = query(dbAging, where("place", "==", place))
		const aResult = await getDocs(aQuery)
		var aArray: MeatInfoAiO[] = []
		aResult.forEach((doc: any) => {
			let data: MeatInfoAiO = doc.data()
			const item: MeatInfoAiO = {
				storedDate: data.storedDate,
				species: data.species,
				cut: data.cut,
				meatNumber: data.meatNumber,
				origin: data.origin,
				gender: data.gender,
				grade: data.grade,
				freeze: data.freeze,
				price: data.price,
				entry: data.entry,
				place: data.place,
				fridgeName: data.fridgeName,
				floor: data.floor,
				beforeWeight: data.beforeWeight,
				agingDate: data.agingDate,
				docId: doc.id,
				ultraTime: data.ultraTime,
				finishDate: data.finishDate,
				afterWeight: data.afterWeight,
				cutWeight: data.cutWeight,
				cutDate: data.cutDate,
				uploadTime: data.uploadTime,
			}
			aArray.push(item)
		})

		setStoredItems(sortMeatInfoArray(sArray))
		setAgingItems(sortMeatInfoArray(aArray))

		thenWhat()
	} catch {
		catchWhat()
	}
}

export async function passToAgingCollection(
	item: MeatInfoWithEntry,
	// thenWhat: () => Promise<void>
) {
	await addDoc(dbAging, {
		storedDate: item.storedDate,
		species: item.species,
		cut: item.cut,
		meatNumber: item.meatNumber,
		origin: item.origin,
		gender: item.gender,
		grade: item.grade,
		freeze: item.freeze,
		price: item.price,
		entry: item.entry,
		fridgeName: item.fridgeName,
		floor: item.floor,
		beforeWeight: item.beforeWeight,
		agingDate: item.agingDate,
		place: item.place,
		ultraTime: item.ultraTime,
	})
		.then(() => console.log("aging으로 넘김"))
		.catch(() => {
			console.error("않되")
		})

	await deleteFromStorage(item.docId)
}

export async function deleteFromStorage(id: string, thenWhat: void) {
	await deleteDoc(doc(firestoreDB, fbCollections.sp2Storage, id))
		.then(async () => {
			console.warn("storage에서 삭제 함")
		})
		.catch(() => {
			console.error("storage에서 삭제하는데 문제생김")
		})
}

export async function deleteFromAgingFridge(id: string, thenWhat: () => void) {
	await deleteDoc(doc(firestoreDB, fbCollections.sp2Aging, id))
		.then(() => thenWhat())
		.catch(() => {
			console.error("aging에서 제거실패")
		})
}

export async function finishAging(item: MeatInfoAiO, thenWhat: () => void) {
	await addDoc(dbRecord, {
		storedDate: item.storedDate,
		species: item.species,
		cut: item.cut,
		meatNumber: item.meatNumber,
		origin: item.origin,
		gender: item.gender,
		grade: item.grade,
		freeze: item.freeze,
		price: item.price,
		entry: item.entry,
		fridgeName: item.fridgeName,
		floor: item.floor,
		beforeWeight: item.beforeWeight,
		agingDate: item.agingDate,
		place: item.place,
		ultraTime: item.ultraTime,
		finishDate: item.finishDate,
		afterWeight: item.afterWeight,
		cutWeight: item.cutWeight,
		cutDate: item.cutDate,
	})
		.then(() => {
			console.log("숙성종료처리 완료")
		})
		.catch(() => {
			console.log("숙성종료처리 실패패")
		})
	deleteFromAgingFridge(item.docId, thenWhat)
}

export async function updateSave(
	docId: string,
	data: MeatInfoAiO,
	thenWhat: () => void,
) {
	const ref = doc(firestoreDB, fbCollections.sp2Aging, docId)
	await updateDoc(ref, {
		afterWeight: data.afterWeight,
		afterDate: data.finishDate,
		cutWeight: data.cutWeight,
		cutDate: data.cutDate,
	}).then(() => thenWhat())
}
