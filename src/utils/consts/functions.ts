import { XMLParser } from "fast-xml-parser"
import { MeatInfoWithEntry } from "../types/meatTypes"
import { collection } from "firebase/firestore"
import { firestoreDB } from "../Firebase"

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
        Number(storedDate.slice(11, 13))
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

export const sortAgingItems = (
    array: MeatInfoWithEntry[]
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
