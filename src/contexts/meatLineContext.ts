import { createContext, useState } from "react"
import { MeatInfo } from "../utils/types/meatTypes"

type SetCurrentContextType = {
    currentContext: MeatInfo | null
    setCurrentContext: React.Dispatch<React.SetStateAction<MeatInfo | null>>
}
type SetTotalContextType = {
    totalContext: Map<MeatInfo, number>
    setTotalContext: React.Dispatch<React.SetStateAction<Map<MeatInfo, number>>>
}
const CurrentMeatLine = {
    currentContext: null,
    setCurrentContext: () => {},
}

const TotalMeatLine = {
    totalContext: new Map(),
    setTotalContext: () => {},
}

export const CurrentMeatLineContext =
    createContext<SetCurrentContextType>(CurrentMeatLine)
export const TotalMeatLineContext =
    createContext<SetTotalContextType>(TotalMeatLine)
