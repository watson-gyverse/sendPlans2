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
	let targetUrl = pyverseUrl + `/?id=${id}` + `&limit=${limit}`
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
