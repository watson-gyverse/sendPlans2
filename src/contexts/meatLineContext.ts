import { createContext } from "react"
type SetStorageContextType = {
    scanText: string
    setScanText: React.Dispatch<React.SetStateAction<string>>
}

const storageContext = {
    scanText: "init_scanText",
    setScanText: () => {},
}

export const StorageContext =
    createContext<SetStorageContextType>(storageContext)
