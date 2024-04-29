import {
	DocumentData,
	QueryFieldFilterConstraint,
	QueryLimitConstraint,
	QueryOrderByConstraint,
	and,
	getDocs,
	query,
} from "firebase/firestore"
import {useCallback, useEffect, useState} from "react"
import {getCollection} from "../utils/consts/functions"
import {MeatInfoAiO, MeatInfoWithEntry} from "../utils/types/meatTypes"
import {ConsignData, FirestorePlace} from "../utils/types/otherTypes"

type FB = FirestorePlace | MeatInfoWithEntry | MeatInfoAiO | ConsignData

const useFBFetch = <T extends FB>(
	collection: string,
	conditions?: QueryFieldFilterConstraint[],
	orderBy?: QueryOrderByConstraint,
	limit?: QueryLimitConstraint,
) => {
	const db = getCollection(collection)

	const q = conditions ? query(db, and(...conditions)) : db
	const [data, setData] = useState<T[]>([])
	const [loading, setLoading] = useState(false)

	const getThem = useCallback(async () => {
		setLoading(true)
		console.log("호출합니다")
		const result = await getDocs(q)
		const list: T[] = []
		result.forEach((doc: DocumentData) => {
			let datum = {...doc.data(), docId: doc.id}
			// console.log(doc.data)
			list.push(datum)
		})
		setData(list)
		setLoading(false)
	}, [q])

	useEffect(() => {
		// console.log("호출 컬렉션: "+collection)
		getThem().then(() => {})
	}, [])

	const refetch = getThem

	return {data, loading, refetch}
}

export default useFBFetch
