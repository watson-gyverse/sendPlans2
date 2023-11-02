import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { EditCard } from "../../components/storage-section/editCard"
import { Button, Modal, Stack } from "react-bootstrap"
import EditModal from "../../components/storage-section/editModal"
import { CSVType, MeatInfoWithCount } from "../../utils/types/meatTypes"
import {
    XlsxType,
    sessionKeys,
    xlsxHeaders,
} from "../../utils/consts/constants"
import { CSVLink } from "react-csv"
import * as xlsx from "xlsx"
export default function EditScreen() {
    const [show, setShow] = useState(false)

    const session = sessionStorage
    const initItems = session.getItem(sessionKeys.storageItems)
    const [items, setItems] = useState<MeatInfoWithCount[]>(
        JSON.parse(initItems ? initItems : "")
    )

    const [recentMeatInfo, setRecentMeatInfo] = useState<
        MeatInfoWithCount | undefined
    >()
    let [csvData, setCSVData] = useState<CSVType[]>([])

    const csvLink = useRef<
        CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
    >(null)

    useEffect(() => {
        console.log("**init use effect**")
        console.log(items)
    }, [])

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
        makeCSVData(tempList)
    }, [recentMeatInfo])

    const makeCSVData = (items: MeatInfoWithCount[]) => {
        let list: CSVType[] = []
        for (let item of items) {
            for (let i = 0; i < item.count; i++) {
                list = [
                    ...list,
                    {
                        storedDate: item.storedDate,
                        meatNumber: item.meatNumber!!,
                        entryNumber: String(i).padStart(3, "0"),
                        species: item.species,
                        origin: item.origin!!,
                        gender: item.gender!!,
                        grade: item.grade!!,
                        cut: item.cut,
                        freeze: item.freeze!!,
                        price: item.price!!,
                    },
                ]
            }
        }
        setCSVData(list)
    }

    // const csvLinkClick = () => {
    //     csvLink?.current?.link.click()
    //     console.log(csvData)
    // }

    const writeXlsx = () => {
        const book = xlsx.utils.book_new()
        const dataForXlsx = csvData.map((item) => {
            let data: XlsxType = {
                입고일: item.storedDate,
                이력번호: item.meatNumber,
                순번: item.entryNumber,
                육종: item.species,
                원산지: item.origin,
                암수: item.gender,
                등급: item.grade,
                부위: item.cut,
                보관: item.freeze,
                단가: item.price,
            }
            return data
        })
        const xlsxData = xlsx.utils.json_to_sheet(dataForXlsx, {
            header: xlsxHeaders,
        })
        xlsx.utils.book_append_sheet(book, xlsxData, "DGAZA")
        xlsx.writeFile(book, "dgatna.xlsx")
    }
    return (
        <div>
            <Toaster />
            <Button onClick={() => toast.success("쓰러갑시다")}>뒤로</Button>
            <Stack gap={2}>
                <h5>전부 입력하기 전에 못 내리신다고</h5>
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
            </Stack>
            {/* <CSVLink
                data={csvData}
                headers={csvHeaders}
                asyncOnClick={true}
                filename={`${new Date().toLocaleDateString("ko-KR")}.csv`}
                ref={csvLink}
                uFEFF={true}
                enclosingCharacter=''
            />
            <Button
                disabled={csvData.some((item) => {
                    for (let key of Object.keys(item)) {
                        if (isNotNull(item[key])) return true
                    }
                    return false
                })}
                onClick={csvLinkClick}
            >
                csv다운로드
            </Button> */}
            <Button onClick={writeXlsx}>드가</Button>
            {/* <CsvDownloader
                columns={csvdHeaders}
                datas={csvData}
                extension='.csv'
                filename='yes'
                wrapColumnChar=''
                bom={true}
                prefix={true}
                separator=','
                meta={true}
            /> */}
            <Modal
                show={show}
                onHide={() => setShow(false)}
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
