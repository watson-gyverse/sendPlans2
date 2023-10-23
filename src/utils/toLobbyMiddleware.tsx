import { Navigate } from "react-router-dom"
import { CurrentMeatLineContext } from "../contexts/meatLineContext"
import { useContext } from "react"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
export const StorageMiddleWare = (props: any) => {
    const { currentContext } = useContext(CurrentMeatLineContext)

    if (currentContext === null) {
        toast("입고일과 고기 정보를 먼저 입력해주세요")
        return (
            <>
                <Toaster />
                <Navigate to={{ pathname: "/submit/preset" }} />{" "}
            </>
        )
    }
    return <React.Fragment>{props.children}</React.Fragment>
}
