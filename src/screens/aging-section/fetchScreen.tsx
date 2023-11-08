import { useEffect, useState } from "react"
import { Button, ButtonGroup, Col, Modal, Row, Stack } from "react-bootstrap"
import { fetchFromFirestore, passToAgingCollection } from "../../apis/agingApi"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { AgingEditCard } from "../../components/aging-section/agingEditCard"
import toast, { Toaster } from "react-hot-toast"
import AgingModal from "../../components/aging-section/agingModal"
import { sortAgingItems } from "../../utils/consts/functions"
import { useLocation } from "react-router-dom"

export const FetchScreen = () => {
    const location = useLocation()
    const placeName = location.state.placeName
    const placeCount = location.state.placeCount

    const [isStorageTap, setTap] = useState(true)
    const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[]>([])
    const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
    const [editModalShow, setEditModalShow] = useState(false)
    const [finishModalShow, setFinishModalShow] = useState(false)
    const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

    useEffect(() => {
        fetchFromFirestore(
            setStoredItems,
            setAgingItems,
            placeName,
            () => {
                console.warn("fetch complete")
            },
            () => {
                console.error("fetch failed")
            }
        )
    }, [])

    useEffect(() => {
        console.log(storedItems)
    }, [storedItems])

    useEffect(() => {
        if (recentMeatInfo === undefined) return
        console.log("++meatinfo changed++")
        console.log(recentMeatInfo)
        let tempList = [...storedItems].filter((item) => {
            if (
                item.meatNumber !== recentMeatInfo.meatNumber ||
                (item.meatNumber === recentMeatInfo.meatNumber &&
                    item.entry !== recentMeatInfo.entry)
            ) {
                return true
            }
        })
        tempList.push(recentMeatInfo)
        console.log("pushed")
        console.log(storedItems)
        console.log(tempList)
        const sorted = [...sortAgingItems(tempList)]
        setStoredItems(sorted)
    }, [recentMeatInfo])

    const onFormSubmitted = (item: MeatInfoWithEntry) => {
        let tempList = [...storedItems].filter((it) => {
            if (
                it.meatNumber !== item.meatNumber ||
                (it.meatNumber === item.meatNumber && it.entry !== item.entry)
            ) {
                return true
            }
        })
        tempList.push(item)
        console.log("pushed")
        console.log(storedItems)
        console.log(tempList)
        const sorted = [...sortAgingItems(tempList)]
        setStoredItems(sorted)
    }

    const onClickStartAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다"
        )
        if (ok) {
            await passToAgingCollection(item)
            await fetchFromFirestore(
                setStoredItems,
                setAgingItems,
                placeName,
                () => {
                    console.log("fetch !@")
                },
                () => {
                    console.log("error !@")
                }
            )
        }
    }

    return (
        <div>
            <Toaster />
            <Col>
                <Row>
                    <p>현재 장소 : {placeName}</p>
                    <ButtonGroup>
                        <Button onClick={() => setTap(true)}>입고됨</Button>
                        <Button onClick={() => setTap(false)}>숙성중</Button>
                    </ButtonGroup>
                </Row>

                <Row>
                    <div>
                        {isStorageTap ? (
                            <Stack gap={2}>
                                <Row>
                                    <h2>입고된 고기 목록</h2>
                                </Row>
                                {storedItems.map((item) => {
                                    return (
                                        <AgingEditCard
                                            key={item.docId}
                                            meatInfo={item}
                                            clickEvent={() => {
                                                setRecentMeatInfo(item)
                                                setEditModalShow(true)
                                            }}
                                            onClosed={(it) => {
                                                onFormSubmitted(it)
                                            }}
                                            startAgingEvent={(it) => {
                                                onClickStartAging(it)
                                            }}
                                        />
                                    )
                                })}
                            </Stack>
                        ) : (
                            <Stack gap={2}>
                                <Row>
                                    <h2>숙성 중인 고기 목록</h2>
                                </Row>
                                {agingItems.map((item) => {
                                    return (
                                        <AgingEditCard
                                            key={item.docId}
                                            meatInfo={item}
                                            clickEvent={() => {
                                                setRecentMeatInfo(item)
                                                setEditModalShow(true)
                                            }}
                                            onClosed={(it) => {
                                                onFormSubmitted(it)
                                            }}
                                            startAgingEvent={(it) => {
                                                onClickStartAging(it)
                                            }}
                                        />
                                    )
                                })}
                            </Stack>
                        )}
                    </div>
                </Row>
            </Col>
            <Modal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>고기 정보 입력/수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {recentMeatInfo !== undefined ? (
                        <AgingModal
                            meatInfo={recentMeatInfo}
                            placeName={placeName}
                            placeCount={placeCount}
                            setMeatInfo={setRecentMeatInfo}
                            setClose={() => setEditModalShow(false)}
                        />
                    ) : (
                        <></>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}
