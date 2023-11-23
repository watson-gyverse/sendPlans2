import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { EditCard } from "../../components/storage-section/editCard"
import { Button, Modal, Stack } from "react-bootstrap"
import EditModal from "../../components/storage-section/editModal"
import { MeatInfoWithCount, XlsxType } from "../../utils/types/meatTypes"
import { sessionKeys, xlsxHeaders } from "../../utils/consts/constants"
import * as xlsx from "xlsx"
import { useNavigate } from "react-router-dom"
import { addToFirestore } from "../../apis/storageApi"
export default function EditScreen() {
    const [show, setShow] = useState(false)

    const session = sessionStorage
    const initItems = session.getItem(sessionKeys.storageItems)
    const [items, setItems] = useState<MeatInfoWithCount[]>(
        JSON.parse(initItems ? initItems : "[]")
    )
    //true : disable
    const [disableButton, setButtonDisabled] = useState(true)

    const [recentMeatInfo, setRecentMeatInfo] = useState<
        MeatInfoWithCount | undefined
    >()
    const [xlsxData, setXlsxData] = useState<XlsxType[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        console.log("**init use effect**")
        console.log(items)
        console.log(xlsxData)
        console.log(dataNullChecker)
        setButtonDisabled(dataNullChecker)
    }, [])
    useEffect(() => {
        console.log(dataNullChecker)
        setButtonDisabled(dataNullChecker)
    }, items)

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
        let list: XlsxType[] = []
        for (let item of items) {
            for (let i = 0; i < item.count; i++) {
                list = [
                    ...list,
                    {
                        입고일: item.storedDate,
                        이력번호: item.meatNumber!!,
                        순번: String(i).padStart(3, "0"),
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
        const book = xlsx.utils.book_new()
        const xlsxLetsgo = xlsx.utils.json_to_sheet(xlsxData, {
            header: xlsxHeaders,
        })
        xlsx.utils.book_append_sheet(book, xlsxLetsgo, "DGAZA")
        xlsx.writeFile(book, "storedInfo.xlsx")
    }

    const addDocumentToFirestore = () => {
        xlsxData.forEach((item) => {
            addToFirestore(
                item,
                () => {
                    toast.success("DB에 등록 성공")
                    // setTimeout(() => {
                    //     navigate("../preset")
                    // }, 1000)
                },
                () => {
                    toast.error("실패했다..!")
                }
            )
        })
    }

    //빈 게 있으면 null
    const dataNullChecker = items.some((item) =>
        Object.values(item).includes(null)
    )
    return (
        <div>
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
                        disabled={disableButton}
                        onClick={writeXlsx}
                    >
                        엑셀로
                        <br />
                        추출하기
                    </Button>
                    <Button
                        disabled={disableButton}
                        onClick={addDocumentToFirestore}
                    >
                        DB에 저장하기
                    </Button>
                </div>
            </Stack>

            <Modal
                show={show}
                onHide={() => {
                    setShow(false)
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>고기 정보 입력/수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {recentMeatInfo !== undefined ? (
                        <EditModal
                            meatInfo={recentMeatInfo}
                            setMeatInfo={setRecentMeatInfo}
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
