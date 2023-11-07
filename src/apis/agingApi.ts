import {
    DocumentData,
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore"
import { MeatInfoWithCount, MeatInfoWithEntry } from "../utils/types/meatTypes"
import { firestoreDB } from "../utils/Firebase"
import { fbStorages } from "../utils/consts/constants"
import { parseToDate } from "../utils/consts/functions"

const dbRef = collection(firestoreDB, fbStorages.sp2Storage)
const q = query(dbRef, where("p", "==", "df"), orderBy("storedDate"))

export async function fetchFromFirestore(
    setArray: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,

    thenWhat: () => void,
    catchWhat: () => void
) {
    const result = await getDocs(dbRef)
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
        }
        array.push(item)
        console.log(item)
    })
    console.log(array)
    setArray(
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
