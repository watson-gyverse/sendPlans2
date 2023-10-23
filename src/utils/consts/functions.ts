import { XMLParser } from "fast-xml-parser"

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
