import { useCallback, useEffect, useState } from "react"
import { Button, Col, Modal, Stack, Tab, Tabs } from "react-bootstrap"
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
import FinishAgingModal from "../../components/aging-section/agingFinishModal"
import _ from "lodash"

export const FetchScreen = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const placeName = location.state.placeName
    const placeCount = location.state.placeCount

    const [isEditMode, setIsEditMode] = useState(false)
    const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[]>([])
    const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
    const [editModalShow, setEditModalShow] = useState(false)
    const [finishModalShow, setFinishModalShow] = useState(false)
    const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

    const [checkedSList, setCheckedSList] = useState<Set<string>>(new Set())
    const [checkedAList, setCheckedAList] = useState<Set<string>>(new Set())
    const [whichTab, setWhichTab] = useState(true)

    function fetch() {
        console.log("request fetch 했습니다요")
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

    //체크된 애들 중 숙성정보 입력을 다 안한 애들이 있는지 검증

    const checkNullCheckedS = () => {
        if (checkedSList.size === 0) {
            return false
        }
        let a = true
        checkedSList.forEach((item) => {
            let it = _.find(storedItems, { docId: item })
            if (it !== undefined) {
                console.log(it)
                if (
                    it.agingDate === null ||
                    it.beforeWeight === null ||
                    it.fridgeName === null ||
                    it.floor === null
                ) {
                    console.log("비활성화함?")
                    a = false
                } else {
                    console.log("비활성화안함?")
                }
            }
        })
        return a
    }

    useEffect(() => {
        fetch()
    }, [])
    useEffect(() => {
        if (recentMeatInfo === undefined) return
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
        const sorted = [...sortAgingItems(tempList)]
        setStoredItems(sorted)
    }, [recentMeatInfo])

    useEffect(() => {
        checkedSList.clear()
    }, [storedItems])
    const onClickBack = () => {
        navigate("../")
    }

    const onTabChanged = (key: string | null) => {
        if (key === "storage") setWhichTab(true)
        else setWhichTab(false)
    }

    const onClickStartAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다."
        )
        if (ok) {
            await passToAgingCollection(item)
            await fetchFromFirestore(
                setStoredItems,
                setAgingItems,
                placeName,
                () => {
                    console.log("fetch !@")
                    fetch()
                },
                () => {
                    console.log("error !@")
                }
            )
        }
    }

    const onClickStartAgingSelected = useCallback(async () => {
        const ok = window.confirm("선택한 아이템을 모두 숙성시작시킵니다.")
        if (ok) {
            checkedSList.forEach(async (item) => {
                const a = _.find(storedItems, { docId: item })
                await passToAgingCollection(a!!)
                await fetchFromFirestore(
                    setStoredItems,
                    setAgingItems,
                    placeName,
                    () => {
                        toast.success("숙성시작 ")
                        console.log("fetch !@")
                        fetch()
                        checkedSList.clear()
                    },
                    () => {
                        console.log("error !@")
                    }
                )
            })
        }
    }, [checkedSList])

    const onClickFinishAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm("숙성종료합니다?")
        if (ok) {
            setFinishModalShow(false)
        }
    }
    const onClickEditModeButton = () => {
        setIsEditMode(!isEditMode)
    }

    const onClickDeleteButton = (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "입고 중인 아이템입니다. 정말 삭제하시겠습니까?"
        )
        if (ok) {
            deleteFromStorage(item.docId!!, fetch())
        }
    }
    const onClickAgingDeleteButton = (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "숙성 중인 아이템입니다. 정말 삭제하시겠습니까?"
        )
        if (ok) {
            deleteFromAgingFridge(item.docId!!, fetch())
        }
    }

    const onCheckAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                const list: Set<string> = new Set()

                if (whichTab) {
                    storedItems.forEach((item: MeatInfoWithEntry) =>
                        list.add(item.docId!!)
                    )
                    setCheckedSList(list)
                } else {
                    agingItems.forEach((item: MeatInfoWithEntry) =>
                        list.add(item.docId!!)
                    )
                    setCheckedAList(list)
                }
            } else {
                whichTab
                    ? setCheckedSList(new Set())
                    : setCheckedAList(new Set())
            }
        },
        [whichTab ? storedItems : agingItems]
    )

    const onCheckElement = (checked: boolean, item: string) => {
        if (checked) {
            if (whichTab) {
                setCheckedSList(new Set([...checkedSList, item]))
            } else {
                setCheckedAList(new Set([...checkedAList, item]))
            }
        } else {
            if (whichTab) {
                const newSSet = new Set(checkedSList)
                newSSet.delete(item)
                setCheckedSList(newSSet)
            } else {
                const newSet = new Set(checkedAList)
                newSet.delete(item)
                setCheckedAList(newSet)
            }
        }
    }

    return (
        <div>
            <Toaster />
            <div style={{ display: "flex", marginBottom: "12px" }}>
                <Button onClick={onClickBack}>뒤로</Button>
                <h2
                    style={{
                        border: "2px solid #0d1b09",
                        borderRadius: "4px",
                        marginLeft: "12px",
                        marginBottom: "0px",
                        color: "white",
                        backgroundColor: "#144b1a",
                    }}
                >
                    {placeName}
                </h2>
            </div>
            <Tabs onSelect={(key) => onTabChanged(key)}>
                <Tab
                    eventKey='storage'
                    title='입고중'
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "right",
                        }}
                    >
                        <Col xs='auto'>
                            <AiFillSetting
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                                onClick={onClickEditModeButton}
                            />
                        </Col>
                    </div>
                    <Stack gap={2}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                marginTop: "10px",
                            }}
                        >
                            <div>
                                <input
                                    type='checkbox'
                                    id='selectSAll'
                                    onChange={(e) =>
                                        onCheckAll(e.target.checked)
                                    }
                                    checked={
                                        checkedSList.size === storedItems.length
                                    }
                                />
                                <label
                                    style={{ marginLeft: "6px" }}
                                    htmlFor='selectSAll'
                                >
                                    전체 선택
                                </label>
                            </div>

                            <Button
                                onClick={onClickStartAgingSelected}
                                disabled={!checkNullCheckedS()}
                                style={{ marginLeft: "20px", height: "3rem" }}
                            >
                                선택한 고기 숙성하기
                            </Button>
                        </div>
                        {storedItems.map((item) => {
                            return (
                                <div>
                                    <input
                                        style={{ marginTop: "20px" }}
                                        type='checkbox'
                                        id={"Scheckbox" + item.docId}
                                        onChange={(e) =>
                                            onCheckElement(
                                                e.target.checked,
                                                item.docId!!
                                            )
                                        }
                                        checked={checkedSList.has(item.docId!!)}
                                    />
                                    <label htmlFor={"Scheckbox" + item.docId}>
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
                                    </label>
                                </div>
                            )
                        })}
                    </Stack>
                </Tab>
                <Tab
                    eventKey='Aging'
                    title='숙성중'
                    onSelect={() => setWhichTab(false)}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "right",
                        }}
                    >
                        <Col xs='auto'>
                            <AiFillSetting
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                                onClick={onClickEditModeButton}
                            />
                        </Col>
                    </div>
                    <Stack gap={2}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                marginTop: "10px",
                            }}
                        >
                            {/* <div>
                                <input
                                    type='checkbox'
                                    id='selectAll'
                                    onChange={(e) =>
                                        onCheckAll(e.target.checked)
                                    }
                                    checked={
                                        checkedAList.size === agingItems.length
                                    }
                                />
                                <label
                                    style={{ marginLeft: "6px" }}
                                    htmlFor='selectAll'
                                >
                                    전체 선택
                                </label>
                            </div>

                            <Button
                                style={{ marginLeft: "20px", height: "3rem" }}
                            >
                                선택한 숙성 종료하기
                            </Button> */}
                        </div>

                        {agingItems.map((item) => {
                            return (
                                <div>
                                    {/* <input
                                        style={{ marginTop: "20px" }}
                                        type='checkbox'
                                        id={"checkbox" + item.docId}
                                        onChange={(e) =>
                                            onCheckElement(
                                                e.target.checked,
                                                item.docId!!
                                            )
                                        }
                                        checked={checkedAList.has(item.docId!!)}
                                    />
                                    <label
                                        style={{ width: "200px" }}
                                        htmlFor={"checkbox" + item.docId}
                                    > */}
                                    <div
                                        style={{
                                            width: "100%",
                                        }}
                                    >
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
                                        />
                                    </div>
                                    {/* </label> */}
                                </div>
                            )
                        })}
                    </Stack>
                </Tab>
            </Tabs>

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
                        <FinishAgingModal
                            meatInfo={recentMeatInfo}
                            finishAgingEvent={() => {
                                onClickFinishAging(recentMeatInfo)
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}
