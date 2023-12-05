import { useCallback, useEffect, useState } from "react"
import { Button, ButtonGroup, Stack, ToggleButton } from "react-bootstrap"
import {
    deleteFromAgingFridge,
    fetchFromFirestore2,
    passToAgingCollection,
} from "../../apis/agingApi"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import toast, { Toaster } from "react-hot-toast"
import AgingModal from "../../components/aging-section/agingModal"
import { useLocation, useNavigate } from "react-router-dom"
import { AgingFinishCard } from "../../components/aging-section/agingFinishCard"
import { AiFillSetting } from "react-icons/ai"
import FinishAgingModal from "../../components/aging-section/agingFinishModal"
import _ from "lodash"
import { backgroundColors } from "../../utils/consts/colors"
import { NewAgingCard } from "../../components/aging-section/agingEditNewCard"
import { AgingEditContextType } from "../../contexts/agingEditContext"
import { sortAgingItems } from "../../utils/consts/functions"

export const FetchScreen2 = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const placeName = "매장"
    const placeCount = 2

    const [isEditMode, setIsEditMode] = useState(false)
    const [rawItems, setRawItems] = useState<MeatInfoWithEntry[]>([])
    const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[][]>([])
    const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
    const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

    const [checkedSList, setCheckedSList] = useState<Set<string>>(new Set())
    const [checkedAList, setCheckedAList] = useState<Set<string>>(new Set())

    const [whichTab, setWhichTab] = useState(true)
    const [editModalShow, setEditModalShow] = useState(false)
    const [finishModalShow, setFinishModalShow] = useState(false)

    function fetch() {
        fetchFromFirestore2(
            setRawItems,
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

    const onClickStartAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다."
        )
        if (ok)
            await startAging(item, setRawItems, setAgingItems, placeName, fetch)
    }

    const agingEditProps: AgingEditContextType = {
        isEditMode: isEditMode,
        setEditMode: setIsEditMode,
        recentMeatInfo: recentMeatInfo,
        setRecentMeatInfo: setRecentMeatInfo,
        setModalShow: setEditModalShow,
        fetch: fetch,
        onClickStartAging: onClickStartAging,
    }

    //true null없음
    const checkNullCheckedS = () => {
        if (checkedSList.size === 0) {
            return false
        }
        let isClean = true
        checkedSList.forEach((item) => {
            let it = _.find(_.flatten(storedItems), { docId: item })
            if (it !== undefined) {
                console.log(it)
                if (
                    it.agingDate === null ||
                    it.beforeWeight === null ||
                    it.fridgeName === null ||
                    it.floor === null
                ) {
                    console.log("비활성화함?")
                    isClean = false
                } else {
                    console.log("비활성화안함?")
                }
            }
        })
        return isClean
    }

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        let init: { [index: string]: Array<MeatInfoWithEntry> } = {}
        const reducedS = rawItems.reduce((acc, cur) => {
            let key = cur.meatNumber
            acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
            return acc
        }, init)
        const converted = sortArray(Object.values(reducedS))
        console.log(converted)
        setStoredItems([...converted])
    }, [rawItems])

    useEffect(() => {
        if (recentMeatInfo === undefined) return
        console.log("@@@@@@@@@@@@@@@@@@@")
        console.log(recentMeatInfo)
        let tempList = [...rawItems].filter((item) => {
            if (
                item.meatNumber !== recentMeatInfo.meatNumber ||
                (item.meatNumber === recentMeatInfo.meatNumber &&
                    item.entry !== recentMeatInfo.entry)
            ) {
                return true
            }
        })
        tempList.push(recentMeatInfo)
        const sorted = sortAgingItems(tempList)
        console.log(sorted)
        setRawItems(sorted)
    }, [recentMeatInfo])

    useEffect(() => {
        console.log(storedItems)
    }, [storedItems])

    function sortArray(oArray: MeatInfoWithEntry[][]): MeatInfoWithEntry[][] {
        const newArray: MeatInfoWithEntry[][] = []
        oArray.forEach((array) => {
            const converted = _.sortBy(
                array,
                (item) => item.entry.split("/")[0]
            )
            console.log(converted)
            newArray.push(converted)
        })
        return newArray
    }

    useEffect(() => {
        console.log(whichTab)
    }, [whichTab])

    const onClickBack = () => {
        navigate("../")
    }

    const onClickStartAgingSelected = useCallback(async () => {
        const ok = window.confirm("선택한 아이템을 모두 숙성시작시킵니다.")
        if (ok) {
            // checkedSList.forEach(async (item) => {
            //     const a = _.find(storedItems, { docId: item })
            //     if (a) {
            //         await startAging(
            //             a,
            //             setStoredItems,
            //             setAgingItems,
            //             placeName,
            //             fetch
            //         )
            //     }
            // })
        }
    }, [checkedSList])

    const onFinishedAging = async (item: MeatInfoWithEntry) => {
        setFinishModalShow(false)
        fetch()
        toast.success("숙성종료 완료")
    }
    const onClickEditModeButton = () => {
        setIsEditMode(!isEditMode)
    }

    // const onClickDeleteButton = (item: MeatInfoWithEntry) => {
    //     const ok = window.confirm(
    //         "입고 중인 아이템입니다. 정말 삭제하시겠습니까?"
    //     )
    //     if (ok) {
    //         deleteFromStorage(item.docId!!, fetch())
    //     }
    // }
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
            console.log(storedItems)
            if (checked) {
                const list: Set<string> = new Set()

                if (whichTab) {
                    // storedItems.forEach((item: MeatInfoWithEntry) =>
                    //     list.add(item.docId!!)
                    // )
                    // setCheckedSList(list)
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
        <div
            style={{
                backgroundColor: backgroundColors.aging,
                padding: "20px 10px",
            }}
        >
            <Toaster />
            <div
                style={{
                    display: "flex",
                    marginBottom: "12px",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    style={{ width: "60px", height: "50px", padding: "0" }}
                    variant='danger'
                    onClick={onClickBack}
                >
                    뒤로
                </Button>
                <h2
                    style={{
                        // border: "2px solid #ff0000",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        color: "white",
                        padding: "8px",
                        backgroundColor: "#3f2c2c",
                        height: "50px",
                        width: "157px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {placeName}
                </h2>
                <div
                    style={{
                        width: "60px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <AiFillSetting
                        style={{
                            width: "30px",
                            height: "30px",
                        }}
                        onClick={onClickEditModeButton}
                    />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <ButtonGroup>
                    <ToggleButton
                        id='storage'
                        className='shadow-none'
                        value='storage'
                        variant='danger'
                        onClick={() => setWhichTab(true)}
                        style={{
                            display: "flex",
                            width: "157px",
                            height: "50px",
                            backgroundColor: whichTab ? "#ff3d3d" : "",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p
                            style={{
                                color: "white",
                                margin: "0",
                            }}
                        >
                            입고중
                        </p>
                    </ToggleButton>
                    <ToggleButton
                        id='aging'
                        className='shadow-none'
                        value='aging'
                        variant='danger'
                        onClick={() => setWhichTab(false)}
                        style={{
                            width: "157px",
                            height: "50px",
                            display: "flex",
                            backgroundColor: whichTab ? "" : "#ff3d3d",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p
                            style={{
                                color: "white",
                                margin: "0",
                            }}
                        >
                            숙성중
                        </p>
                    </ToggleButton>
                </ButtonGroup>
            </div>
            {whichTab ? (
                <Stack gap={2}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "10px",
                        }}
                    >
                        <div>
                            <input
                                type='checkbox'
                                id='selectSAll'
                                onChange={(e) => onCheckAll(e.target.checked)}
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
                            style={{
                                marginLeft: "20px",
                                height: "3rem",
                            }}
                            variant='danger'
                        >
                            선택한 고기 숙성하기
                        </Button>
                    </div>
                    {storedItems.map((ss) => {
                        return (
                            <NewAgingCard
                                items={ss}
                                agingEditProps={agingEditProps}
                            />
                        )
                    })}
                </Stack>
            ) : (
                <Stack gap={2}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                            marginTop: "10px",
                        }}
                    ></div>

                    {agingItems.map((item) => {
                        return (
                            <div>
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
                            </div>
                        )
                    })}
                </Stack>
            )}

            {recentMeatInfo !== undefined ? (
                <AgingModal
                    meatInfo={recentMeatInfo}
                    placeName={placeName}
                    placeCount={placeCount}
                    setMeatInfo={setRecentMeatInfo}
                    setClose={() => setEditModalShow(false)}
                    show={editModalShow}
                    setShow={setEditModalShow}
                />
            ) : (
                <></>
            )}

            {recentMeatInfo !== undefined ? (
                <FinishAgingModal
                    meatInfo={recentMeatInfo}
                    finishAgingEvent={() => {
                        onFinishedAging(recentMeatInfo)
                    }}
                    show={finishModalShow}
                    setShow={setFinishModalShow}
                />
            ) : (
                <></>
            )}
        </div>
    )
}
async function startAging(
    item: MeatInfoWithEntry,
    setRawItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    placeName: any,
    fetch: () => void
) {
    {
        await passToAgingCollection(item)
        await fetchFromFirestore2(
            setRawItems,
            setAgingItems,
            placeName,
            () => {
                console.log("success and fetch")
                fetch()
            },
            () => {
                console.log("error !@")
            }
        )
    }
}
