import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import { MeatInfoWithEntry } from "../utils/types/meatTypes"
import { firestoreDB } from "../utils/Firebase"
import { fbCollections } from "../utils/consts/constants"
import { parseToDate } from "../utils/consts/functions"
import { FirestorePlace } from "../utils/types/otherTypes"

const dbStorage = getCollection(fbCollections.sp2Storage)
const dbAging = getCollection(fbCollections.sp2Aging)
const dbPlace = getCollection(fbCollections.sp2Places)

function getCollection(dbName: string) {
    return collection(firestoreDB, dbName)
}

export async function fetchFromFirestore(
    setStoredItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    place: string,
    thenWhat: () => void,
    catchWhat: () => void
) {
    const sResult = await getDocs(dbStorage)
    var sArray: MeatInfoWithEntry[] = []
    sResult.forEach((doc: any) => {
        let data: MeatInfoWithEntry = doc.data()
        console.log(doc.id, "=>", doc.data())
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
            place: null,
            fridgeName: null,
            floor: null,
            beforeWeight: null,
            agingDate: null,
            docId: doc.id,
        }
        sArray.push(item)
        console.log(item)
    })
    const aQuery = query(dbAging, where("place", "==", place))
    const aResult = await getDocs(aQuery)
    var aArray: MeatInfoWithEntry[] = []
    aResult.forEach((doc: any) => {
        let data: MeatInfoWithEntry = doc.data()
        console.log(doc.id, "=>", doc.data())
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
            place: data.place,
            fridgeName: data.fridgeName,
            floor: data.floor,
            beforeWeight: data.beforeWeight,
            agingDate: data.agingDate,
            docId: doc.id,
        }
        aArray.push(item)
    })
    setStoredItems(sortArray(sArray))
    setAgingItems(sortArray(aArray))
}

export async function passToAgingCollection(
    item: MeatInfoWithEntry
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
    })
        .then(() => console.warn("오예"))
        .catch(() => {
            console.error("않되")
        })

    await deleteDoc(doc(firestoreDB, fbCollections.sp2Storage, item.docId!!))
        .then(async () => {
            console.warn("삭제도함")
            // thenWhat()
        })
        .catch(() => {
            console.error("삭제하는데 문제생김")
        })
}

export async function getPlaces(
    setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>
) {
    const result = await getDocs(dbPlace)
    var places: FirestorePlace[] = []
    result.forEach((doc: any) => {
        let data: FirestorePlace = {
            id: doc.id,
            name: doc.data().name,
            count: doc.data().count,
        }
        places.push(data)
    })

    setPlaces(places)
}

function sortArray(array: MeatInfoWithEntry[]) {
    return array.sort((a, b) => {
        if (a.storedDate !== b.storedDate) {
            return (
                parseToDate(a.storedDate).getTime() -
                parseToDate(b.storedDate).getTime()
            )
        } else {
            if (a.meatNumber !== b.meatNumber) {
                return Number(a.meatNumber) - Number(b.meatNumber)
            } else {
                return Number(a.entry) - Number(b.entry)
            }
        }
    })
}

export async function addPlace(
    placeName: string,
    count: string,
    setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>
) {
    await addDoc(dbPlace, {
        name: placeName,
        count: count,
    })
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
    setPlaces: React.Dispatch<React.SetStateAction<FirestorePlace[]>>
) {
    await deleteDoc(doc(firestoreDB, fbCollections.sp2Places, placeId))
        .then(() => {
            console.log("장소 삭제됨")
            getPlaces(setPlaces)
        })
        .catch(() => console.error("장소 삭제실패"))
}
