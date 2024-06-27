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

export type PyverseData = {
	id: number
	timestamp: string
	store: string
	species: string
	cut: string
	grade: string
	name: string
	freeze: string
	total_price: number
	price: number
	weight: number
	min_weight: number
	max_weight: number
	avg_weight: number
	date: string
	exp_date: string
	stock: number
	origin: string
	brand: string
	fat_back: number
	fat_section: number
	inner_fat: number
	url: string
}

// 1070,"2024-06-26 09:48:41","ds푸드","수입 소고기","부채살","CHOICE","[냉장] IBP 부채살(SRA) [IBP] 수입소 /부채살 /CHOICE등급 /2","냉장",0,16300,0,0,0,0,"2024-05-08","2024-08-07",0,"수입산 (미국)","IBP",0,0,0,"https://www.dsfoodmall.com/products/view/G2001131303"]
