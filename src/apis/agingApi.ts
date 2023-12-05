import {
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore"
import { MeatInfoAiO, MeatInfoWithEntry } from "../utils/types/meatTypes"
import { firestoreDB } from "../utils/Firebase"
import { fbCollections } from "../utils/consts/constants"
import {
    getCollection,
    sortMeatInfoArray,
    sortMeatInfoArray2,
} from "../utils/consts/functions"
import _ from "lodash"
const dbStorage = getCollection(fbCollections.sp2Storage)
const dbAging = getCollection(fbCollections.sp2Aging)
const dbRecord = getCollection(fbCollections.sp2Record)

export async function fetchFromFirestore(
    setStoredItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    place: string,
    thenWhat: () => void,
    catchWhat: () => void
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
            place: null,
            fridgeName: null,
            floor: null,
            beforeWeight: null,
            agingDate: null,
            docId: doc.id,
            ultraTime: null,
        }
        sArray.push(item)
    })
    //aging
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
            ultraTime: data.ultraTime,
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
    catchWhat: () => void
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
                place: null,
                fridgeName: null,
                floor: null,
                beforeWeight: null,
                agingDate: null,
                docId: doc.id,
                ultraTime: null,
            }
            sArray.push(item)
        })
        //aging
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
                ultraTime: data.ultraTime,
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
        ultraTime: item.ultraTime,
    })
        .then(() => console.warn("aging으로 넘김"))
        .catch(() => {
            console.error("않되")
        })

    deleteFromStorage(item.docId!!)
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

export async function deleteFromAgingFridge(id: string, thenWhat: void) {
    await deleteDoc(doc(firestoreDB, fbCollections.sp2Aging, id))
        .then(() => {
            console.log("aging에서 제거완")
        })
        .catch(() => {
            console.error("aging에서 제거실패")
        })
}

export async function finishAging(item: MeatInfoAiO, thenWhat: void) {
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
    })
        .then(() => {
            console.log("숙성종료처리 완료")
        })
        .catch(() => {
            console.log("숙성종료처리 실패패")
        })
    deleteFromAgingFridge(item.docId!!).then(() => thenWhat)
}
