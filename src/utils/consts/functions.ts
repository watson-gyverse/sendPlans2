import {XMLParser} from "fast-xml-parser"
import {
	MeatInfoWithCount,
	MeatInfoWithEntry,
	XlsxStoreType,
} from "../types/meatTypes"
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

export function sortMeatInfoArray(array: MeatInfoWithEntry[]) {
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

export function sortMeatInfoArray2(array: MeatInfoWithEntry[][]) {
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

export const sortAgingItems = (
	array: MeatInfoWithEntry[],
): MeatInfoWithEntry[] => {
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
export const ThreeStep = /\B(?=(\d{3})+(?!\d))/g
export function ThreeStepComma(string: string) {
	return string.replace(ThreeStep, ",")
}

export function storingXlsxData(items: MeatInfoWithCount[]): XlsxStoreType[] {
	let list: XlsxStoreType[] = []
	for (let item of items) {
		for (let i = 1; i <= item.count; i++) {
			list = [
				...list,
				{
					입고일: item.storedDate,
					이력번호: item.meatNumber!!,
					순번:
						String(i).padStart(2, "0") +
						"/" +
						String(item.count).padStart(2, "0"),
					육종: item.species,
					원산지: item.origin!!,
					암수: item.gender!!,
					등급: item.grade!!,
					부위: item.cut,
					보관: item.freeze!!,
					단가: item.price!!,
				},
			]
		}
	}
	return list
}
export function sortArray<T>(
	oArray: T[][],
	iteratees: _.Many<_.ListIteratee<T>>[],
): T[][] {
	const newArray: T[][] = []
	oArray.forEach((array) => {
		const converted = _.sortBy(array, ...iteratees)

		newArray.push(converted)
	})
	return newArray
}

export function checkValidAccount(): boolean {
	const token = localStorage.getItem("token")
	const email = localStorage.getItem("email")
	if (!token || token === "") {
		return false
	}
	if (email && checkValidEmail(email)) {
		return true
	}

	return false
}

export function checkValidEmail(email: string): boolean {
	if (allowedMails.some((mail) => mail.startsWith(email))) {
		return true
	}
	if (email.split("@")[1].startsWith("gyverse")) return true
	return false
}
const allowedMails = ["mg.poc.240812@gmail.com", "sofivne@gmail.com"]

export function addUserPropertyToData<T>(data: T): T & {user: string} {
	const user = localStorage.getItem("email")
	if (!user) return {...data, user: "-1"}
	if (user.includes("gyverse.com")) {
		return {...data, user: "가이버스"}
	}
	return {...data, user}
}
