import {MeatInfoWithCount} from "../types/meatTypes"

export const BeefCuts = [
	"살치",
	"부채살",
	"윗등심",
	"아랫등심",
	"토마호크",
	"채끝",
	"티본",
	"목심",
	"갈비",
	"양지",
	"우둔",
	"설도",
	"안심",
]

export const PorkCuts = [
	"목살",
	"삼겹살",
	"돈등심",
	"돈안심",
	"갈비",
	"앞다리",
	"뒷다리",
	"돈마호크",
]

export const BeefOriginAndGrades: Map<string, string[]> = new Map([
	["국산", ["1++", "1+", "1", "2", "3", "등외"]],
	["미국", ["프라임", "CAB", "초이스", "셀렉트", "등외"]],
	["호주", ["MB 7/8/9", "MB 4/5/6", "MB 1/2/3", "GF", "S", "A"]],
	["캐나다", ["프라임", "AAA", "AA", "A", "등외(무등급)"]],
	["멕시코", ["등외(무등급)"]],
	["칠레", ["프리고오소노", "테무코"]],
	["스페인", ["베요타", "세보데캄보", "세보"]],
])

export const PorkOriginAndGrades: Map<string, string[]> = new Map([
	["국산", ["1+", "1", "2", "3", "등외"]],
	["미국", ["등외"]],
	["호주", ["등외"]],
	["캐나다", ["등외"]],
	["멕시코", ["등외"]],
	["칠레", ["등외"]],
	["스페인", ["등외"]],
])

const dummyMeatInfo: MeatInfoWithCount = {
	storedDate: new Date().toLocaleDateString("ko-KR"),
	species: "돼지",
	cut: "목살",
	meatNumber: "646464144141",
	origin: null,
	//아래는 소만 조회되고 돼지는 직접 기입
	gender: null,
	grade: null,
	freeze: null,
	price: null,
	count: 2,
	uploadTime: null,
}
const dummyMeatInfo2: MeatInfoWithCount = {
	storedDate: new Date().toLocaleDateString("ko-KR"),
	species: "소",
	cut: "채끝",
	meatNumber: "432112344321",
	origin: null,
	//아래는 소만 조회되고 돼지는 직접 기입
	gender: null,
	grade: null,
	freeze: null,
	price: null,
	count: 3,
	uploadTime: null,
}
export const dummys = [dummyMeatInfo, dummyMeatInfo2]
