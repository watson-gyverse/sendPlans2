import { Button, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import {
    CurrentMeatLineContext,
    TotalMeatLineContext,
} from "../contexts/meatLineContext"
import { useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function MainScreen() {
    const navigate = useNavigate()
    const naviToDateScreen = () => {
        toast.remove()
        navigate("/storage/preset")
    }
    const naviToAgingScreen = () => {
        toast("숙성반드시해야지")
        // toast.remove()
        navigate("/aging/")
    }
    const naviToHistoryScreen = () => {
        toast("입고/숙성기록")
        // toast.remove()
        // navigate("/storage/preset")
    }

    const { totalContext, setTotalContext } = useContext(TotalMeatLineContext)
    const { currentContext, setCurrentContext } = useContext(
        CurrentMeatLineContext
    )

    useEffect(() => {
        console.log(totalContext)
        console.log(currentContext)
    }, [])

    useEffect(() => {
        console.log(totalContext)
    }, [totalContext])
    useEffect(() => {
        console.log(currentContext)
    }, [currentContext])

    const samples = (
        <Stack>
            <Toaster />
            <Button
                variant='secondary'
                onClick={() => {
                    toast.success("ㅇㅇ")
                }}
            >
                출근하기
            </Button>
            <Button
                variant='success'
                onClick={() => {
                    toast.error("ㅇㅇ")
                }}
            >
                퇴근하기
            </Button>
            <Button variant='info'>플리바꾸기</Button>
            <Button variant='light'>눈마사지하기</Button>
            <Button variant='dark'>물떠오기</Button>
            <Button variant='link'>건전지갈기</Button>
        </Stack>
    )

    return (
        <div
            style={{
                backgroundColor: "lightgray",
            }}
        >
            <Stack gap={3}>
                <h1>SendPlans</h1>
                <Button
                    variant='primary'
                    onClick={naviToDateScreen}
                >
                    입고하기
                </Button>
                <Button
                    variant='danger'
                    onClick={naviToAgingScreen}
                >
                    숙성하기
                </Button>
                <Button
                    variant='warning'
                    onClick={naviToHistoryScreen}
                >
                    조회하기
                </Button>
                {samples}
            </Stack>
        </div>
    )
}
