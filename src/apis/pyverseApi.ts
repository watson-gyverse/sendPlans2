import axios from "axios"
import {pyverseUrl} from "../utils/consts/urls"
import {PyverseData} from "../utils/types/otherTypes"

export async function GetRecentPyverse(): Promise<PyverseData[] | null> {
	if (!pyverseUrl) return null

	const result = await axios.get(pyverseUrl)

	const items = result.data
	return items
}
