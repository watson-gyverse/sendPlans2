import axios from "axios"
import {bizNoUrl} from "../utils/consts/urls"

type bizItem = {
	company: string
	bno: string
	cno: string
	bsttcd: string
	bstt: string
	TaxTypeCd: string
	taxtype: string
	EndDt: string
}

export async function GetFromBizNum(
	gb: number,
	q: string,
): Promise<bizItem | null> {
	try {
		if (!bizNoUrl) {
			return null
		}
		const result = await axios.get(bizNoUrl, {
			params: {
				gb: gb,
				q: q,
			},
		})
		const items = result.data.data.items
		if (items !== null && items !== "") {
			const item = items[0]

			return item
		} else {
			console.log("널죽이겠다", result.data)
			return null
		}
	} catch (err) {
		console.error(err)
		console.log("hmm..")

		return null
	}
}
