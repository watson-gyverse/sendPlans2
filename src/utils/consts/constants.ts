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
