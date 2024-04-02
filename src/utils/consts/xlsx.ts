import {MeatInfoWithEntry, XlsxAgingType} from "../types/meatTypes"
import * as XLSX from "xlsx"
import {xlsxAgingHeaders} from "./constants"

export function agingXlsxBuilder(data: MeatInfoWithEntry[]) {
	let xlsxs: XlsxAgingType[] = []
	data.forEach((datum) => {
		let dataRow: XlsxAgingType = {
			입고일: datum.storedDate,
			숙성시작일: datum.agingDate!!,
			숙성전무게: String(datum.beforeWeight),
			냉장고번호: datum.fridgeName!!,
			냉장고층: String(datum.floor),
			초음파: String(datum.ultraTime) + "h",
			이력번호: datum.meatNumber!!,
			순번: datum.entry,
			육종: datum.species,
			원산지: datum.origin!!,
			암수: datum.gender!!,
			등급: datum.grade!!,
			부위: datum.cut!!,
			보관: datum.freeze!!,
			단가: datum.price!!,
		}
		xlsxs.push(dataRow)
	})

	const book = XLSX.utils.book_new()
	const xlsxLetsgo = XLSX.utils.json_to_sheet(xlsxs, {
		header: xlsxAgingHeaders,
	})
	XLSX.utils.book_append_sheet(book, xlsxLetsgo, "StoreSheet")
	if (xlsxs.length > 0) {
		XLSX.writeFile(
			book,
			// xlsxs[0].숙성시작일 + " " + time +
			`aging ${new Date().toLocaleString("ko-KR")}.xlsx`,
		)
	}
}
