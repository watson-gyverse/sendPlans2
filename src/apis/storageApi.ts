import { Firestore, addDoc, collection, getFirestore } from "firebase/firestore"
import { MeatInfoWithCount, XlsxType } from "../utils/types/meatTypes"
import { fbStorages } from "../utils/consts/constants"
import { firestoreDB } from "../utils/Firebase"

export async function addToFirestore(
    data: XlsxType,
    thenWhat: () => void,
    catchWhat: () => void
) {
    await addDoc(collection(firestoreDB, fbStorages.sp2Storage), {
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
    })
        .then(() => {
            thenWhat()
        })
        .catch(() => {
            catchWhat()
        })
}
