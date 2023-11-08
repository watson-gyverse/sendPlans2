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
    setItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,

    thenWhat: () => void,
    catchWhat: () => void
) {
    const result = await getDocs(dbStorage)
    var array: MeatInfoWithEntry[] = []
    result.forEach((doc: any) => {
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
        array.push(item)
        console.log(item)
    })
    console.log(array)
    setItems(
        array.sort((a, b) => {
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
    )
}

export async function passToAgingCollection(
    item: MeatInfoWithEntry,
    thenWhat: Promise<void>
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
            await thenWhat
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
        let data: FirestorePlace = doc.data()
        places.push(data)
    })

    setPlaces(places)
}
