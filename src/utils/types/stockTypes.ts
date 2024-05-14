export type StockCategory = {
	docId: string //문서id 문자열
	order: number //순서
	catName: string
	products: StockProduct[]
}

export type StockProduct = {
	prdOrder: number //카테고리 내에서 순서
	prdName: string
	prdCnt: number
	color: string | null
}

//재고증감 기록
export type StockOrder = {
	dateTime: string
	orders: StockOrderItem[]
	memo: string
}

export type StockOrderItem = {
	catId: string
	catName: string
	prdName: string
	change: number
	curStock: number
}
