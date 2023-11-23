import { Button, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { GiCardboardBoxClosed, GiTemporaryShield } from "react-icons/gi"
import { RiTimer2Line, RiHistoryFill } from "react-icons/ri"
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
                <b style={{ fontSize: "3rem" }}>미트가이버</b>
                <p style={{ fontSize: "2.2rem" }}>입고/숙성 관리</p>
                <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                    <Button
                        style={{ height: "140px", width: "140px" }}
                        variant='primary'
                        onClick={naviToDateScreen}
                    >
                        <GiCardboardBoxClosed
                            style={{ height: "60px", width: "60px" }}
                        />
                        <br />
                        입고하기
                    </Button>
                    <Button
                        style={{ height: "140px", width: "140px" }}
                        variant='danger'
                        onClick={naviToAgingScreen}
                    >
                        <RiTimer2Line
                            style={{ height: "60px", width: "60px" }}
                        />
                        <br />
                        숙성하기
                    </Button>
                </div>

                <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                    <Button
                        style={{ height: "140px", width: "140px" }}
                        variant='warning'
                        onClick={naviToHistoryScreen}
                    >
                        <RiHistoryFill
                            style={{ height: "60px", width: "60px" }}
                        />
                        <br />
                        조회하기
                    </Button>
                    <div style={{ height: "140px", width: "140px" }}></div>
                </div>

                {/* {samples} */}
            </Stack>
        </div>
    )
}
