import toast, { Toaster } from "react-hot-toast"
import { EditCard } from "../../components/storage-section/editCard"
import { Button, Modal, Stack } from "react-bootstrap"
import EditModal from "../../components/storage-section/editModal"
import { MeatInfoWithCount, XlsxStoreType } from "../../utils/types/meatTypes"
import { sessionKeys, xlsxHeaders } from "../../utils/consts/constants"
import * as xlsx from "xlsx"
import { useNavigate } from "react-router-dom"
import { addToFirestore } from "../../apis/storageApi"
import { backgroundColors } from "../../utils/consts/colors"
import _ from "lodash"
import { useCallback, useEffect, useState } from "react"
export default function EditScreen() {
    const [show, setShow] = useState(false)

    const session = sessionStorage
    const initItems = session.getItem(sessionKeys.storageItems)
    const [items, setItems] = useState<MeatInfoWithCount[]>(
        JSON.parse(initItems ? initItems : "[]")
    )
    //true : disable
    const [disableXlsxButton, setXlsxButtonDisabled] = useState(true)
    const [disableButton, setButtonDisabled] = useState(true)

    const [recentMeatInfo, setRecentMeatInfo] = useState<
        MeatInfoWithCount | undefined
    >()
    const [xlsxData, setXlsxData] = useState<XlsxStoreType[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        setXlsxButtonDisabled(dataNullChecker)
        setButtonDisabled(dataNullChecker)
    }, [])
    useEffect(() => {
        setXlsxButtonDisabled(dataNullChecker)
        setButtonDisabled(dataNullChecker)
    }, [items])

    useEffect(() => {
        if (recentMeatInfo === undefined) {
            console.error("recentMeatInfo : undefined")
            return
        }
        console.log("++meatinfo changed++")
        console.log(recentMeatInfo)
        let tempList = items.filter((item) => {
            return item.meatNumber !== recentMeatInfo.meatNumber
        })
        tempList.push(recentMeatInfo)
        setItems(tempList)
        makeXlsxData(tempList)
    }, [recentMeatInfo])

    const makeXlsxData = (items: MeatInfoWithCount[]) => {
        let list: XlsxStoreType[] = []
        for (let item of items) {
            for (let i = 1; i <= item.count; i++) {
                list = [
                    ...list,
                    {
                        입고일: item.storedDate,
                        이력번호: item.meatNumber!!,
                        순번:
                            String(i).padStart(2, "0") +
                            "/" +
                            String(item.count).padStart(2, "0"),
                        육종: item.species,
                        원산지: item.origin!!,
                        암수: item.gender!!,
                        등급: item.grade!!,
                        부위: item.cut,
                        보관: item.freeze!!,
                        단가: item.price!!,
                    },
                ]
            }
        }
        setXlsxData(list)
    }

    const writeXlsx = () => {
        console.log("디바운스좀해주세요")
        const book = xlsx.utils.book_new()
        const xlsxLetsgo = xlsx.utils.json_to_sheet(xlsxData, {
            header: xlsxHeaders,
        })
        xlsx.utils.book_append_sheet(book, xlsxLetsgo, "StoreSheet")
        xlsx.writeFile(book, xlsxData[0].입고일 + " storage.xlsx")
    }
    const sendFirestore = () => {
        xlsxData.forEach((item) => {
            addToFirestore(
                item,
                () => {
                    toast.success("DB에 등록 성공")
                    setButtonDisabled(true)
                },
                () => {
                    toast.error("실패했다..!")
                }
            )
        })
    }

    const write = useCallback(_.debounce(writeXlsx, 2000), [xlsxData])

    const send = useCallback(_.debounce(sendFirestore, 2000), [xlsxData])

    //빈 게 있으면 null
    const dataNullChecker = items.some((item) =>
        Object.values(item).includes(null)
    )
    return (
        <div
            style={{
                backgroundColor: backgroundColors.storage_back,
                padding: "20px 10px",
            }}
        >
            <Toaster />
            <Stack gap={2}>
                <Button
                    style={{ width: "100px", height: "4rem" }}
                    onClick={() => navigate("../camera")}
                    variant='secondary'
                >
                    뒤로
                </Button>
                {/* <h5>전부 입력하기 전에 못 내리신다고</h5> */}
                {items
                    .sort((a, b) => Number(a.meatNumber) - Number(b.meatNumber))
                    .map((item: MeatInfoWithCount) => {
                        return (
                            <EditCard
                                key={item.meatNumber!! + item.price}
                                meatInfo={item}
                                clickEvent={() => {
                                    setShow(!show)
                                    setRecentMeatInfo(item)
                                }}
                            />
                        )
                    })}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Button
                        style={{ backgroundColor: "#217346", border: "none" }}
                        disabled={disableXlsxButton}
                        onClick={write}
                    >
                        엑셀로
                        <br />
                        추출하기
                    </Button>
                    <Button
                        style={{ backgroundColor: "#ffcb2b", border: "none" }}
                        disabled={disableButton}
                        onClick={send}
                    >
                        DB에
                        <br />
                        저장하기
                    </Button>
                </div>
            </Stack>

            {recentMeatInfo ? (
                <EditModal
                    meatInfo={recentMeatInfo}
                    setMeatInfo={setRecentMeatInfo}
                    setClose={() => setShow(false)}
                    show={show}
                    setShow={setShow}
                />
            ) : (
                <></>
            )}
        </div>
    )
}
