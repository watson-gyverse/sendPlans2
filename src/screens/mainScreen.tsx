import { Button, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

export default function MainScreen() {
    const navigate = useNavigate()
    const naviToDateScreen = () => {
        toast.remove()
        navigate("/storage/preset")
    }
    const naviToAgingScreen = () => {
        toast.remove()
        navigate("/aging/")
    }
    const naviToHistoryScreen = () => {
        // toast.remove()
        toast("입고/숙성기록\n업데이트 예정")

        navigate("/record")
    }

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
        <div>
            <Toaster />
            <Stack gap={3}>
                <h1>미트가이버</h1>
                <h2>입고/숙성 관리</h2>
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
                {/* {samples} */}
            </Stack>
        </div>
    )
}
