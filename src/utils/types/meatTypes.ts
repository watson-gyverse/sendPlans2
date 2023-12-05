export type MeatPreset = {
    storedDate: string
    species: string
    cut: string
}

export type MeatScanned = MeatPreset & {
    meatNumber: string
    //국산/수입
    origin: string | null
    //아래는 소만 조회되고 돼지는 직접 기입
    gender: string | null
    grade: string | null
}

export type MeatInfo = MeatScanned & {
    freeze: string | null
    price: string | null
}

export type MeatInfoWithCount = MeatInfo & {
    count: number
}

export type MeatInfoWithEntry = MeatInfo & {
    entry: string
    place: string | null
    fridgeName: string | null
    floor: number | null
    beforeWeight: number | null
    agingDate: string | null
    docId: string
    ultraTime: number | null
}

//all in one
export type MeatInfoAiO = MeatInfoWithEntry & {
    finishDate: string
    afterWeight: number
    cutWeight: number
    docId: string | null
}

export type XlsxStoreType = {
    [index: string]: string
    입고일: string
    이력번호: string
    순번: string
    육종: string
    원산지: string
    암수: string
    등급: string
    부위: string
    보관: string
    단가: string
}
export type XlsxAgingType = {
    [index: string]: string
    입고일: string
    숙성시작일: string
    숙성전무게: string
    냉장고번호: string
    냉장고층: string
    이력번호: string
    순번: string
    육종: string
    원산지: string
    암수: string
    등급: string
    부위: string
    보관: string
    단가: string
}
