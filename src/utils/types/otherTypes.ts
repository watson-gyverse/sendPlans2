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
	afterDate: string | null
	cutWeight: number | null
	cutDate: string | null
	items: ConsignItem[]
	docId: string | null
}

export type ConsignCsvData = {
	id: string
	client: string
	meatNumber: string
	cut: string
	initWeight: number
	initDate: string
	afterWeight: string
	afterDate: string
	cutWeight: string
	cutDate: string
	itemWeight: number
}
