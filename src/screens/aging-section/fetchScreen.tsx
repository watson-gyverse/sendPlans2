import { useEffect, useState } from "react"
import { Col, Row, Stack } from "react-bootstrap"
import { fetchFromFirestore } from "../../apis/agingApi"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { AgingEditCard } from "../../components/aging-section/agingEditCard"
import toast, { Toaster } from "react-hot-toast"

export const FetchScreen = () => {
    const session = window.sessionStorage
    const placeText = session.getItem("place")
    const [items, setItems] = useState<MeatInfoWithEntry[]>([])

    useEffect(() => {
        fetchFromFirestore(
            setItems,
            () => {
                console.warn("fetch complete")
            },
            () => {
                console.error("fetch failed")
            }
        )
    }, [])

    useEffect(() => {
        console.log(items)
    }, [items])
    return (
        <div>
            <Toaster />
            <Col>
                <Row>
                    <p>현재 장소 : {placeText}</p>
                </Row>
                <Row>
                    <h1>입고된 고기 목록</h1>
                </Row>
                <Row>
                    <Stack gap={2}>
                        {items.map((item) => {
                            return (
                                <AgingEditCard
                                    meatInfo={item}
                                    clickEvent={() => {
                                        toast.success("er")
                                    }}
                                />
                            )
                        })}
                    </Stack>
                </Row>
            </Col>
        </div>
    )
}
