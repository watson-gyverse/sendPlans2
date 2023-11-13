import { useEffect, useState } from "react"
import { Button, ButtonGroup, Col, Modal, Row, Stack } from "react-bootstrap"
import {
    deleteFromAgingFridge,
    deleteFromStorage,
    fetchFromFirestore,
    passToAgingCollection,
} from "../../apis/agingApi"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { AgingEditCard } from "../../components/aging-section/agingEditCard"
import toast, { Toaster } from "react-hot-toast"
import AgingModal from "../../components/aging-section/agingModal"
import { sortAgingItems } from "../../utils/consts/functions"
import { useLocation, useNavigate } from "react-router-dom"
import { AgingFinishCard } from "../../components/aging-section/agingFinishCard"
import { AiFillSetting } from "react-icons/ai"

export const FetchScreen = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const placeName = location.state.placeName
    const placeCount = location.state.placeCount

    const [isEditMode, setIsEditMode] = useState(false)
    const [isStorageTap, setTap] = useState(true)
    const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[]>([])
    const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
    const [editModalShow, setEditModalShow] = useState(false)
    const [finishModalShow, setFinishModalShow] = useState(false)
    const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

    function fetch() {
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
    }

    useEffect(() => {
        fetch()
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

    const onClickBack = () => {
        navigate("../")
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

    const onClickFinishAging = async (item: MeatInfoWithEntry) => {
        toast("숙 성 종 료 하 려 고 ")
        setFinishModalShow(true)
    }

    const onClickEditModeButton = () => {
        setIsEditMode(!isEditMode)
    }

    const onClickDeleteButton = (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "입고 중인 아이템입니다. 정말 삭제하시겠습니까?"
        )
        if (ok) {
            toast.error("할까말까")
            deleteFromStorage(item.docId!!, fetch())
        }
    }
    const onClickAgingDeleteButton = (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "숙성 중인 아이템입니다. 정말 삭제하시겠습니까?"
        )
        if (ok) {
            toast.error("할까말까")
            deleteFromAgingFridge(item.docId!!, fetch())
        }
    }
    return (
        <div>
            <Toaster />
            <Col>
                <Row>
                    <div>
                        <Button onClick={onClickBack}>뒤로</Button>
                        <h2
                            style={{
                                width: "auto",
                                border: "2px solid #1f68f0",
                                borderRadius: "4px",
                                marginLeft: "12px",
                            }}
                        >
                            {placeName}
                        </h2>
                    </div>

                    <ButtonGroup>
                        <Button onClick={() => setTap(true)}>입고됨</Button>
                        <Button onClick={() => setTap(false)}>숙성중</Button>
                    </ButtonGroup>
                </Row>

                <Row style={{ marginTop: "20px" }}>
                    <div>
                        <Row>
                            <Col style={{ marginLeft: "10px" }}>
                                {isStorageTap ? (
                                    <h3>입고된 고기 목록</h3>
                                ) : (
                                    <h3>숙성 중인 고기 목록</h3>
                                )}
                            </Col>
                            <Col xs='auto'>
                                <AiFillSetting
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                    }}
                                    onClick={onClickEditModeButton}
                                />
                            </Col>
                        </Row>
                        {isStorageTap ? (
                            <Stack gap={2}>
                                {storedItems.map((item) => {
                                    return (
                                        <AgingEditCard
                                            key={item.docId}
                                            meatInfo={item}
                                            isEditMode={isEditMode}
                                            clickEvent={() => {
                                                setRecentMeatInfo(item)
                                                setEditModalShow(true)
                                            }}
                                            onClickDelete={(it) => {
                                                onClickDeleteButton(it)
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
                                {agingItems.map((item) => {
                                    return (
                                        <AgingFinishCard
                                            key={item.docId}
                                            meatInfo={item}
                                            isEditMode={isEditMode}
                                            clickEvent={() => {
                                                setRecentMeatInfo(item)
                                                setFinishModalShow(true)
                                            }}
                                            onClickDelete={() =>
                                                onClickAgingDeleteButton(item)
                                            }
                                            finishAgingEvent={(it) => {
                                                onClickFinishAging(it)
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
            <Modal
                show={finishModalShow}
                onHide={() => setFinishModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>숙성 완료</Modal.Title>
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
