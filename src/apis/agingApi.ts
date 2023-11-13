import {
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore"
import { MeatInfoWithEntry } from "../utils/types/meatTypes"
import { firestoreDB } from "../utils/Firebase"
import { fbCollections } from "../utils/consts/constants"
import { getCollection, sortMeatInfoArray } from "../utils/consts/functions"
const dbStorage = getCollection(fbCollections.sp2Storage)
const dbAging = getCollection(fbCollections.sp2Aging)

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
    })
    const aQuery = query(dbAging, where("place", "==", place))
    const aResult = await getDocs(aQuery)
    var aArray: MeatInfoWithEntry[] = []
    aResult.forEach((doc: any) => {
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
            place: data.place,
            fridgeName: data.fridgeName,
            floor: data.floor,
            beforeWeight: data.beforeWeight,
            agingDate: data.agingDate,
            docId: doc.id,
        }
        aArray.push(item)
    })
    setStoredItems(sortMeatInfoArray(sArray))
    setAgingItems(sortMeatInfoArray(aArray))
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

    deleteFromStorage(item.docId!!)
}

export async function deleteFromStorage(id: string, thenWhat: void) {
    await deleteDoc(doc(firestoreDB, fbCollections.sp2Storage, id))
        .then(async () => {
            console.warn("삭제도함")
        })
        .catch(() => {
            console.error("삭제하는데 문제생김")
        })
}

export async function deleteFromAgingFridge(id: string, thenWhat: void) {
    await deleteDoc(doc(firestoreDB, fbCollections.sp2Aging, id))
        .then(() => {
            console.log("제거완")
        })
        .catch(() => {
            console.error("제거실패")
        })
}
