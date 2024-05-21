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
	const result = await axios.get(bizNoUrl, {
		params: {
			gb: gb,
			q: q,
		},
	})
	try {
		const items = result.data.data.items
		if (items !== null && items !== "") {
			console.log("여기선: ", items)

			const item = items[0]
			console.log("notnull: ", item)
			const company = item.company
			const stt = item.bsttcd //01 계속사업자, 02 휴업자, 03 폐업자
			return item
		} else {
			console.log("널죽이겠다", result.data)
			return null
		}
	} catch (err) {
		console.error(err)
		console.log("hmm..", result.data)

		return null
	}
}
