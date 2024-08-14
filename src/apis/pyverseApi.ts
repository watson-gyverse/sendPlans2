import axios from "axios"
import {pyverseUrl} from "../utils/consts/urls"
import {PyverseData} from "../utils/types/otherTypes"
import {PyDataSorter} from "../utils/consts/constants"

export async function GetRecentPyverse(
	cut: string,
	grade: string,
	store: string,
	id: number,
	limit: number = 40,
	sorted?: PyDataSorter, //정렬 방법 enum
): Promise<PyverseData[] | null> {
	if (!pyverseUrl) return null
	// let targetUrl = pyverseUrl + `/?id=${id}` + `&limit=${limit}`
	// let params: any = {id: id, limit: limit}
	const params = new URLSearchParams()
	params.append("id", String(id))
	params.append("limit", String(limit))
	if (cut !== "") {
		// targetUrl = targetUrl + `&cut=${cut}`
		params.append("cut", cut)
	}
	if (grade !== "") {
		params.append("grade", grade)
	}
	if (store !== "") {
		params.append("store", store)
		// console.log("request url: ", targetUrl)
	}
	if (sorted !== undefined) {
		params.append("sorter", String(sorted))
	}
	const result = await axios.get(pyverseUrl + "?" + params.toString())

	const items = result.data

	return items
}
