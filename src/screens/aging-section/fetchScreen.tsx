import { useEffect, useState } from "react"
import { Col, Modal, Row, Stack } from "react-bootstrap"
import { fetchFromFirestore, passToAgingCollection } from "../../apis/agingApi"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { AgingEditCard } from "../../components/aging-section/agingEditCard"
import toast, { Toaster } from "react-hot-toast"
import AgingModal from "../../components/aging-section/agingModal"
import { sessionKeys } from "../../utils/consts/constants"
import { sortAgingItems } from "../../utils/consts/functions"

export const FetchScreen = () => {
    const session = window.sessionStorage
    const placeText = session.getItem(sessionKeys.agingPlace)
    const [items, setItems] = useState<MeatInfoWithEntry[]>([])
    const [modalShow, setShow] = useState(false)
    const [recentMeatInfo, setClickedItem] = useState<MeatInfoWithEntry>()

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

    useEffect(() => {
        if (recentMeatInfo === undefined) return
        console.log("++meatinfo changed++")

        console.log(recentMeatInfo)
        let tempList = items.filter((item) => {
            return (
                item.meatNumber !== recentMeatInfo.meatNumber ||
                (item.meatNumber === recentMeatInfo.meatNumber &&
                    item.entry !== recentMeatInfo.entry)
            )
        })
        tempList.push(recentMeatInfo)
        setItems(sortAgingItems(tempList))
    }, [recentMeatInfo])

    const onClickStartAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다"
        )
        if (ok) {
            await passToAgingCollection(
                item,
                fetchFromFirestore(
                    setItems,
                    () => {
                        let tempList = items.filter((it) => {
                            return (
                                it.meatNumber !== item.meatNumber ||
                                (it.meatNumber === item.meatNumber &&
                                    it.entry !== item.entry)
                            )
                        })
                        setItems(tempList)
                    },
                    () => {
                        console.error("fetch failed")
                    }
                )
            )
        }
    }

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
                                        setClickedItem(item)
                                        setShow(true)
                                    }}
                                    startAgingEvent={(item) => {
                                        onClickStartAging(item)
                                    }}
                                />
                            )
                        })}
                    </Stack>
                </Row>
            </Col>
            <Modal
                show={modalShow}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>고기 정보 입력/수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {recentMeatInfo !== undefined ? (
                        <AgingModal
                            meatInfo={recentMeatInfo}
                            place={placeText!!}
                            setMeatInfo={setClickedItem}
                            setClose={() => setShow(false)}
                        />
                    ) : (
                        <></>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}
