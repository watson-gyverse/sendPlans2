import { useCallback, useEffect, useState } from "react"
import {
    Button,
    ButtonGroup,
    Modal,
    Stack,
    ToggleButton,
} from "react-bootstrap"
import {
    deleteFromAgingFridge,
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
import { backgroundColors } from "../../utils/consts/colors"
import { NewAgingCard } from "../../components/aging-section/agingEditNewCard"
import { AgingEditContextType } from "../../contexts/agingEditContext"

export const FetchScreen = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const placeName = location.state.placeName
    const placeCount = location.state.placeCount

    const [isEditMode, setIsEditMode] = useState(false)
    const [storedItems, setStoredItems] = useState<MeatInfoWithEntry[]>([])
    const [storedItemsS, setStoredItemsS] = useState<MeatInfoWithEntry[][]>([])
    const [agingItems, setAgingItems] = useState<MeatInfoWithEntry[]>([])
    const [editModalShow, setEditModalShow] = useState(false)
    const [finishModalShow, setFinishModalShow] = useState(false)
    const [recentMeatInfo, setRecentMeatInfo] = useState<MeatInfoWithEntry>()

    const [checkedSList, setCheckedSList] = useState<string[]>([])
    const [checkedAList, setCheckedAList] = useState<string[]>([])
    const [whichTab, setWhichTab] = useState(true)

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

    //체크된 애들 중 숙성정보 입력을 다 안한 애들이 있는지 검증

    const onClickStartAging = async (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "이대로 숙성을 진행하시겠습니까? 취소할 수 없습니다."
        )
        if (ok)
            await startAging(
                item,
                setStoredItems,
                setAgingItems,
                placeName,
                fetch
            )
    }

    const agingEditProps: AgingEditContextType = {
        isEditMode: isEditMode,
        setEditMode: setIsEditMode,
        recentMeatInfo: recentMeatInfo,
        setRecentMeatInfo: setRecentMeatInfo,
        setModalShow: setEditModalShow,
        fetch: fetch,
        onClickStartAging: onClickStartAging,
        checkedSList: checkedSList,
        setCheckedSList: setCheckedSList,
    }

    const checkNullCheckedS = () => {
        if (checkedSList.length === 0) {
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
        console.log("recent변경")
    }, [recentMeatInfo])

    useEffect(() => {
        console.log("stored변경", storedItems)
        setCheckedSList([])
        let init: { [index: string]: Array<MeatInfoWithEntry> } = {}
        const reducedS = storedItems.reduce((acc, cur) => {
            let key = cur.meatNumber
            acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
            return acc
        }, init)

        const sArrayArray = Object.values(reducedS)

        setStoredItemsS(sortArray(sArrayArray))
    }, [storedItems])

    function sortArray(oArray: MeatInfoWithEntry[][]): MeatInfoWithEntry[][] {
        oArray.forEach((array) => {
            _.sortBy(array, "entry")
            console.log(array)
        })
        return oArray
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
            checkedSList.forEach(async (item) => {
                const a = _.find(storedItems, { docId: item })
                if (a) {
                    await startAging(
                        a,
                        setStoredItems,
                        setAgingItems,
                        placeName,
                        fetch
                    )
                }
            })
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
            if (checked) {
                const list: string[] = []

                if (whichTab) {
                    storedItems.forEach((item: MeatInfoWithEntry) =>
                        list.push(item.docId!!)
                    )
                    setCheckedSList(list)
                } else {
                    agingItems.forEach((item: MeatInfoWithEntry) =>
                        list.push(item.docId!!)
                    )
                    setCheckedAList(list)
                }
            } else {
                whichTab ? setCheckedSList([]) : setCheckedAList([])
            }
        },
        [whichTab ? storedItems : agingItems]
    )

    const onCheckElement = (checked: boolean, item: string) => {
        if (checked) {
            if (whichTab) {
                setCheckedSList([...checkedSList, item])
            } else {
                setCheckedAList([...checkedAList, item])
            }
        } else {
            if (whichTab) {
                const newList = _.pull(checkedSList, item)
                setCheckedSList(newList)
            } else {
                const newList = _.pull(checkedAList, item)
                setCheckedAList(newList)
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
                                    checkedSList.length === storedItems.length
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
                    {storedItemsS.map((ss) => {
                        return (
                            <NewAgingCard
                                items={ss}
                                agingEditProps={agingEditProps}
                            />
                        )
                    })}

                    {storedItems.map((item) => {
                        return (
                            <div>
                                <input
                                    type='checkbox'
                                    id={"Scheckbox" + item.docId}
                                    onChange={(e) =>
                                        onCheckElement(
                                            e.target.checked,
                                            item.docId!!
                                        )
                                    }
                                    checked={_.includes(
                                        checkedSList,
                                        item.docId!!
                                    )}
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
                                        // onClickDelete={(it) => {
                                        //     onClickDeleteButton(it)
                                        // }}
                                        startAgingEvent={(it) => {
                                            onClickStartAging(it)
                                        }}
                                    />
                                </label>
                            </div>
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
    setStoredItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    setAgingItems: React.Dispatch<React.SetStateAction<MeatInfoWithEntry[]>>,
    placeName: any,
    fetch: () => void
) {
    {
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
