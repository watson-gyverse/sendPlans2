import axios from "axios"
import {
    SYS_ID,
    foreignMeatInfoUrl,
    meatInfoKey,
    meatInfoUrl,
} from "../utils/consts/urls"

import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser"
import { xmlThatIWannaKill } from "../utils/consts/functions"
import { BeefCuts } from "../utils/consts/meat"

export async function getMeatInfo(
    meatNumber: string,
    setGrade: (setGrade: string) => void,
    setScanSpecies: (scanSpecies: string) => void,
    setGender: (scanGender: string) => void,
    setOrigin: (scanOrigin: string) => void,
    setLoadingState: (loadingState: number) => void,
    setFailed: (hasFailed: boolean) => void,
    setWrongCut: (isWrong: boolean) => void
) {
    try {
        await axios
            .get(meatInfoUrl, {
                params: {
                    ServiceKey: meatInfoKey,
                    traceNo: meatNumber,
                },
            })
            .then((response) => {
                console.log(response)
                var a = response["data"]["response"]["body"]["items"]["item"]
                var index = -1
                switch (a[0]["traceNoType"]) {
                    case "CATTLE|CATTLE_NO": {
                        //소 개체 (소, 국산, 성별, 등급)
                        setScanSpecies("소")
                        let s = a[0]["sexNm"]
                        console.log(s)
                        console.log(a.length)
                        if (s === "암") {
                            setGender("암소")
                        } else {
                            setGender("한우 거세")
                        }
                        for (let i = 0; i < a.length; i++) {
                            if (a[i].hasOwnProperty("gradeNm")) {
                                let g = a[i].gradeNm
                                index = i
                                console.log("grade" + g)
                                setGrade(g + "")
                                break
                            }
                        }
                        break
                    }
                    case "CATTLE|LOT_NO": {
                        setScanSpecies("한우(묶음)")
                        console.log(Object.keys(a).length)
                        var set = new Set()
                        for (let i = 1; i < Object.keys(a).length; i++) {
                            set.add(a[i]["cattleNo"])
                        }
                        break
                    }
                    case "PIG|PIG_NO": {
                        setScanSpecies("돼지")
                        break
                    }
                    case "PIG|LOT_NO": {
                        // 얘는 걍 돼지임
                        setScanSpecies("돼지")
                    }
                }
                console.log(a)
                let s = a[0]["sexNm"]
                console.log(s)
                let g = a[index]["gradeNm"]
                console.log(g)
                setGrade(g)
                setOrigin("국산")
                setLoadingState(2)
            })
    } catch (err) {
        console.log(err)
    }
}

export async function getForeignMeatInfo(
    meatNumber: string,
    setGrade: (setGrade: string) => void,
    setScanSpecies: (scanSpecies: string) => void,
    setGender: (scanGender: string) => void,
    setOrigin: (scanOrigin: string) => void,
    setLoadingState: (loadingState: number) => void,
    setFailed: (hasFailed: boolean) => void,
    setWrongCut: (isWrong: boolean) => void
) {
    try {
        await axios
            .get(foreignMeatInfoUrl, {
                params: {
                    SYS_ID: SYS_ID,
                    DISTB_IDNTFC_NO: meatNumber,
                },
            })
            .then((response) => {
                console.log(response)
                const species = xmlThatIWannaKill(response.data, "kprodNm")
                console.log(species)
                if (species.substring(0, 1) == "소") {
                    setScanSpecies("소")
                } else if (species.substring(0, 1) == "돼") {
                    setScanSpecies("돼지")
                }
                setGrade("-")
                setGender("-")
                setOrigin("-")
                setLoadingState(2)
            })
    } catch (err) {
        console.log(err)
        setFailed(true)
    }
}
