import { useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
export default function Layout() {
    const navigate = useNavigate()

    const onLogOut = async () => {
        navigate("/main")
    }

    setTimeout(() => {
        navigate("/main")
    }, 1000)
    return (
        <div
            id='detail'
            style={{ paddingBottom: "10px" }}
        >
            <Button
                variant='primary'
                onClick={onLogOut}
            >
                맨첨
            </Button>

            <div>{/* <h6>{output}</h6> */}</div>
        </div>
    )
}
