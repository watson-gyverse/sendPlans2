import {XMLParser} from "fast-xml-parser"
import {MeatInfoAiO, MeatInfoWithEntry} from "../types/meatTypes"
import {collection} from "firebase/firestore"
import {firestoreDB} from "../Firebase"
import _ from "lodash"

export function printKorDate(date: Date) {
	const dateString = date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})
	const dayName = date.toLocaleDateString("ko-KR", {
		weekday: "long",
	})

	return `${dateString} ${dayName}`
}
export function xmlThatIWannaKill(xmlString: string, paramId: string): string {
	const option = {
		ignoreAttributes: false,
		attributeNamePrefix: "",
	}
	const parser = new XMLParser(option)
	const output = parser.parse(xmlString)
	const json = JSON.stringify(output)
	console.log(output.root.PARAMS)
	for (let param of output.root.PARAMS.PARAM) {
		if (param.id === paramId) {
			return param[`#text`]
		}
	}
	return "none"
}

export const parseToDate = (storedDate: string): Date => {
	const cDate = new Date(
		Number(storedDate.slice(0, 4)),
		Number(storedDate.slice(5, 7)),
		Number(storedDate.slice(8, 10)),
		Number(storedDate.slice(11, 13)),
	)
	return cDate
}

export function sortMeatInfoArray(array: MeatInfoAiO[]) {
	return array
		.slice()
		.sort((a, b) => a.storedDate.localeCompare(b.storedDate))
		.sort((a, b) => a.entry.localeCompare(b.entry))
		.sort((a, b) => a.meatNumber.localeCompare(b.meatNumber))
}

export function sortMeatInfoArray2(array: MeatInfoAiO[][]) {
	return array.sort((a, b) => {
		let a0 = a[0]
		let b0 = b[0]
		if (a0.storedDate !== b0.storedDate) {
			return (
				parseToDate(a0.storedDate).getTime() -
				parseToDate(b0.storedDate).getTime()
			)
		} else {
			if (a0.meatNumber !== b0.meatNumber) {
				return Number(a0.meatNumber) - Number(b0.meatNumber)
			} else {
				return Number(a0.entry) - Number(b0.entry)
			}
		}
	})
}

export const sortAgingItems = (array: MeatInfoAiO[]): MeatInfoAiO[] => {
	return array.sort((a, b) => {
		if (a.storedDate !== b.storedDate) {
			return (
				parseToDate(a.storedDate).getTime() -
				parseToDate(b.storedDate).getTime()
			)
		} else {
			if (a.meatNumber !== b.meatNumber) {
				return Number(a.meatNumber) - Number(b.meatNumber)
			} else {
				return Number(a.entry) - Number(b.entry)
			}
		}
	})
}
export function getCollection(dbName: string) {
	return collection(firestoreDB, dbName)
}
export function padNumber(num: number, digits: number) {
	return String(num).padStart(digits, "0")
}
export function makeStepArray(length: number): number[] {
	return Array.from({length: length}, (_, i) => {
		return i + 1
	}).sort()
}
export function isNullOrNanOrUndefined(a: any): boolean {
	if (a === null || a === undefined || Number.isNaN(a)) {
		return true
	}
	return false
}

export const checkProperty = <T extends object, K extends keyof T>(
	obj: T,
	path: K,
) => {
	const value = _.get(obj, path)
	const hasProperty = _.has(obj, path)
	const isNullOrUndefined = _.isNil(value)

	return hasProperty || isNullOrUndefined
}
