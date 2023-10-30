export const sessionKeys = {
    storageDate: "storageDate",
    storageSpecies: "storageSpecies",
    storageCut: "storageCut",
    storagePreset: "storagePreset",
    storageItems: "storageItems",
} as const

export type SessionKeys = (typeof sessionKeys)[keyof typeof sessionKeys]
