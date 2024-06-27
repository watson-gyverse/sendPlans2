import {
	DocumentData,
	QueryFieldFilterConstraint,
	QueryOrderByConstraint,
	and,
	getDocs,
	query,
	QueryDocumentSnapshot,
	QueryStartAtConstraint,
	QueryEndAtConstraint,
	QueryLimitConstraint,
} from "firebase/firestore"
import {useCallback, useEffect, useState} from "react"
import {getCollection} from "../utils/consts/functions"
import {MeatInfoAiO, MeatInfoWithEntry} from "../utils/types/meatTypes"
import {ConsignData, FirestorePlace} from "../utils/types/otherTypes"
import {StockCategory, StockOrder} from "../utils/types/stockTypes"

type FB =
	| FirestorePlace
	| MeatInfoWithEntry
	| MeatInfoAiO
	| ConsignData
	| StockCategory
	| StockOrder

const useFBFetch = <T extends FB>(
	collection: string,
	conditions?: QueryFieldFilterConstraint[],
	orderBy?: QueryOrderByConstraint,
	limit?: QueryLimitConstraint,
	cursor?: QueryStartAtConstraint | QueryEndAtConstraint,
) => {
	const db = getCollection(collection)
	let q = conditions ? query(db, and(...conditions)) : db
	if (orderBy) {
		q = query(q, orderBy)
	}
	if (limit) q = query(q, limit)
	if (cursor) {
		q = query(q, cursor)
	}

	const [data, setData] = useState<T[]>([])
	const [loading, setLoading] = useState(false)
	const [firstDoc, setFirstDoc] =
		useState<QueryDocumentSnapshot<DocumentData, DocumentData>>()
	const [lastDoc, setLastDoc] =
		useState<QueryDocumentSnapshot<DocumentData, DocumentData>>()
	const getThem = useCallback(async () => {
		setLoading(true)
		// console.log("호출합니다", q)
		const result = await getDocs(q)
		setFirstDoc(result.docs[0])
		setLastDoc(result.docs[result.docs.length - 1])
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

	return {
		data,
		loading,
		refetch,
		firstDoc,
		lastDoc,
	}
}

export default useFBFetch
