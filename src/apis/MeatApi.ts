import axios from "axios"
import {meatInfoUrl} from "../utils/consts/urls"
import {xmlThatIWannaKill} from "../utils/consts/functions"
import {Exception} from "sass"

export async function getMeatInfo(
	meatNumber: string,
	setGrade: (setGrade: string) => void,
	setScanSpecies: (scanSpecies: string) => void,
	setGender: (scanGender: string) => void,
	setOrigin: (scanOrigin: string) => void,
	setLoadingState: (loadingState: boolean) => void,
	setFailed: (hasFailed: boolean) => void,
) {
	try {
		meatInfoUrl &&
			(await axios
				.get(meatInfoUrl, {
					params: {
						isLocal: true,
						traceNo: meatNumber,
					},
					withCredentials: true,
				})
				.then((response) => {
					console.log(response)
					var a = response.data.data
					console.log(typeof a)
					if (typeof a === "undefined") {
						throw Exception
					}
					// var index = -1
					switch (a[0].traceNoType) {
						case "CATTLE|CATTLE_NO": {
							//소 개체 (소, 국산, 성별, 등급)
							setScanSpecies("소")
							let s = a[0]["sexNm"]
							console.log(s)
							console.log(a.length)
							if (s === "암") {
								setGender("암")
							} else {
								setGender("수")
							}
							for (let i = 0; i < a.length; i++) {
								if (a[i].hasOwnProperty("gradeNm")) {
									let g = a[i].gradeNm
									// index = i
									console.log("grade" + g)
									setGrade(g + "")
									break
								}
							}
							break
						}
						case "CATTLE|LOT_NO": {
							setScanSpecies("소")
							console.log(Object.keys(a).length)
							var set = new Set()
							for (let i = 1; i < Object.keys(a).length; i++) {
								set.add(a[i]["cattleNo"])
							}
							setGrade("-")
							setGender("-")
							break
						}
						case "PIG|PIG_NO": {
							setScanSpecies("돼지")
							setGrade("-")
							setGender("-")
							break
						}
						case "PIG|LOT_NO": {
							// 얘는 걍 돼지임
							setScanSpecies("돼지")
							setGrade("-")
							setGender("-")
						}
					}
					// console.log(a)
					// let s = a[0]["sexNm"]
					// console.log(s)
					// let g = _.get(a[index], "gradeNm", "-")
					// console.log(g)

					// setGrade(g)

					setOrigin("국산")
					setLoadingState(false)
					setFailed(false)
				})
				.catch((err) => {
					console.log(err)
					setFailed(true)
				}))
	} catch (err) {
		console.log(err)
		setFailed(true)
	}
}

export async function getForeignMeatInfo(
	meatNumber: string,
	setGrade: (setGrade: string) => void,
	setScanSpecies: (scanSpecies: string) => void,
	setGender: (scanGender: string) => void,
	setOrigin: (scanOrigin: string) => void,
	setLoadingState: (loadingState: boolean) => void,
	setFailed: (hasFailed: boolean) => void,
) {
	try {
		meatInfoUrl &&
			(await axios
				.get(meatInfoUrl, {
					params: {
						isLocal: false,
						traceNo: meatNumber,
					},
				})
				.then((response) => {
					console.log(response.data)
					const species = xmlThatIWannaKill(response.data.data, "kprodNm")
					console.log(species)
					if (species.substring(0, 1) === "소") {
						setScanSpecies("소")
					} else if (species.substring(0, 1) === "돼") {
						setScanSpecies("돼지")
					}
					setGrade("-")
					setGender("-")
					setOrigin("-")
					setLoadingState(false)
				}))
	} catch (err) {
		console.log(err)
		setFailed(true)
		setLoadingState(false)
	}
}
