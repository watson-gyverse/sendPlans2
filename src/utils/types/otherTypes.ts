export type FirestorePlace = {
	id: string | null
	name: string
	count: string
}

//위탁 덩이 type
export type ConsignItem = {
	id: number
	weight: number
}

//위탁숙성 데이터
export type ConsignData = {
	id: number
	client: string
	meatNumber: string
	cut: string
	initWeight: number
	initDate: string
	afterWeight: number | null
	cutWeight: number | null
	items: ConsignItem[]
	docId: string | null
}
