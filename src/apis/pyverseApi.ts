import axios from "axios"
import {pyverseUrl} from "../utils/consts/urls"
import {PyverseData} from "../utils/types/otherTypes"

export async function GetRecentPyverse(
	cut: string,
	grade: string,
	store: string,
	id: number,
	limit: number = 40,
): Promise<PyverseData[] | null> {
	if (!pyverseUrl) return null
	// let targetUrl = pyverseUrl + `/?id=${id}` + `&limit=${limit}`
	let params: any = {id: id, limit: limit}
	if (cut !== "") {
		// targetUrl = targetUrl + `&cut=${cut}`
		params.cut = cut
	}
	if (grade !== "") {
		params.grade = grade
	}
	if (store !== "") {
		params.store = store
		// console.log("request url: ", targetUrl)
	}
	const result = await axios.get(pyverseUrl, {params: params})

	const items = result.data
	console.log(items)

	return items
}
