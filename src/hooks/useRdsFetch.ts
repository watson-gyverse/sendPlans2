import {useCallback, useEffect, useState} from "react"
import {PyverseData} from "../utils/types/otherTypes"
import {pyverseUrl} from "../utils/consts/urls"
import axios from "axios"

// type Rds = PyverseData
const useRdsFetch = <T extends PyverseData>(
	cut: string,
	grade: string,
	store: string,
	id: number,
	limit?: number,
) => {
	const [data, setData] = useState<T[]>([])
	const [loading, setLoading] = useState(false)

	const getThem = useCallback(async () => {
		setLoading(true)
		const result: T[] | null = (await GetRecentPyverse(
			cut,
			grade,
			store,
			id,
			limit,
		)) as T[] | null
		if (result) {
			setData(result)
		}
		setLoading(true)
	}, [cut, grade, store, id, limit])

	// useEffect(() => {
	// 	getThem().then(() => {})
	// }, [])

	const refetch = getThem

	return {
		data,
		loading,
		refetch,
	}
}

async function GetRecentPyverse(
	cut: string,
	grade: string,
	store: string,
	id: number,
	limit: number = 40,
): Promise<PyverseData[] | null> {
	if (!pyverseUrl) return null
	let targetUrl = pyverseUrl + `/?id=${id}&limit=${limit}`
	if (cut !== "") {
		targetUrl = targetUrl + `&cut=${cut}`
	}
	if (grade !== "") {
		targetUrl = targetUrl + `&grade=${grade}`
	}
	if (store !== "") {
		targetUrl += `&store=${store}`
	}
	console.log("request url: ", targetUrl)

	const result = await axios.get(targetUrl)
	console.log(result)

	const items = result.data
	return items
}

export default useRdsFetch
