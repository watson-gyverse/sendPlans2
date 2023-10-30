import { createContext, useState } from "react"
import { MeatInfo, MeatInfoWithCount } from "../utils/types/meatTypes"

type SetCurrentContextType = {
    currentContext: MeatInfo | null
    setCurrentContext: React.Dispatch<React.SetStateAction<MeatInfo | null>>
}
type SetTotalContextType = {
    totalContext: Map<string, MeatInfoWithCount>
    setTotalContext: React.Dispatch<
        React.SetStateAction<Map<string, MeatInfoWithCount>>
    >
}
type SetScanTextContextType = {
    scanText: string
    setScanText: React.Dispatch<React.SetStateAction<string>>
}
const CurrentMeatLine = {
    currentContext: null,
    setCurrentContext: () => {},
}

const TotalMeatLine = {
    totalContext: new Map(),
    setTotalContext: () => {},
}

const CurrentScanText = { scanText: "init_scanText", setScanText: () => {} }

export const CurrentMeatLineContext =
    createContext<SetCurrentContextType>(CurrentMeatLine)
export const TotalMeatLineContext =
    createContext<SetTotalContextType>(TotalMeatLine)

export const CurrentScanTextContext =
    createContext<SetScanTextContextType>(CurrentScanText)
