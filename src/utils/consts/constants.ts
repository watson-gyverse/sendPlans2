export const sessionKeys = {
    storageDate: "storageDate",
    storageSpecies: "storageSpecies",
    storageCut: "storageCut",
    storagePreset: "storagePreset",
    storageItems: "storageItems",
} as const

export type SessionKeys = (typeof sessionKeys)[keyof typeof sessionKeys]

export const csvHeaders = [
    { label: "입고일", key: "storedDate" },
    { label: "이력번호", key: "meatNumber" },
    { label: "순번", key: "entryNumber" },
    { label: "육종", key: "species" },
    { label: "원산지", key: "origin" },
    { label: "암수", key: "gender" },
    { label: "등급", key: "grade" },
    { label: "부위", key: "cut" },
    { label: "냉장/냉동", key: "freeze" },
    { label: "단가", key: "price" },
]

export const xlsxHeaders = [
    "입고일",
    "이력번호",
    "순번",
    "육종",
    "원산지",
    "암수",
    "등급",
    "부위",
    "보관",
    "단가",
]

export type XlsxType = {
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
