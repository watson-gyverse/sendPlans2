import {
    DocumentData,
    QueryFieldFilterConstraint,
    getDocs,
    query,
} from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"
import { getCollection } from "../utils/consts/functions"
import { MeatInfoAiO, MeatInfoWithEntry } from "../utils/types/meatTypes"
import { FirestorePlace } from "../utils/types/otherTypes"

type FB = FirestorePlace | MeatInfoWithEntry | MeatInfoAiO

const useFBFetch = <T extends FB>(
    collection: string,
    where?: QueryFieldFilterConstraint
) => {
    const db = getCollection(collection)

    const q = where ? query(db, where) : db
    const [data, setData] = useState<T[]>([])
    const [loading, setLoading] = useState(false)

    const getThem = useCallback(async () => {
         setLoading(true)
            console.log("호출합니다")
            const result = await getDocs(q)
            const list: T[] = []
            result.forEach((doc: DocumentData) => {
                let datum = { ...doc.data(), docId: doc.id }
                console.log(doc)
                list.push(datum)
            })
            setData(list)
            setLoading(false)
    },[q])

    useEffect(() => {
        // console.log("호출 컬렉션: "+collection)
        getThem().then(() => {})
    }, [])

    return { data, loading }
}

export default useFBFetch
