import { Button, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

export default function PlaceScreen() {
    const navigate = useNavigate()
    const session = window.sessionStorage
    const onCatButton = () => {
        session.setItem("place", "카대")
        navigate("fetch")
    }
    const onMaeButton = () => {
        session.setItem("place", "매장")
        navigate("fetch")
    }

    return (
        <div>
            placeScreen
            <Stack gap={3}>
                <Button
                    style={{ height: "4rem" }}
                    variant='primary'
                    onClick={onMaeButton}
                >
                    매장
                </Button>
                <Button
                    style={{ height: "4rem" }}
                    variant='secondary'
                    onClick={onCatButton}
                >
                    카대
                </Button>
            </Stack>
        </div>
    )
}
