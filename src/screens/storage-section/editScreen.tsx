import { useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { TotalMeatLineContext } from "../../contexts/meatLineContext"
import { EditCard } from "../../components/storage-section/editCard"
import { Button, Modal, Stack } from "react-bootstrap"
import EditModal from "../../components/storage-section/editModal"
import { MeatInfo, MeatInfoWithCount } from "../../utils/types/meatTypes"
import { dummys } from "../../utils/consts/meat"

export default function EditScreen() {
    const { totalContext, setTotalContext } = useContext(TotalMeatLineContext)
    const [show, setShow] = useState(false)
    const [currentSpecies, setCurrentSpecies] = useState<string>("")

    const newMap = new Map().set(dummys[0].meatNumber, dummys[0])
    newMap.set(dummys[1].meatNumber, dummys[1])
    const sorted = new Map([...totalContext].sort())
    const [dummyHash, setDHash] =
        useState<Map<string, MeatInfoWithCount>>(sorted)
    const [recentMeatInfo, setRecentMeatInfo] = useState<
        MeatInfoWithCount | undefined
    >()

    useEffect(() => {
        // toast("하이요")
        console.log("****")
        if (totalContext.size != 0) {
            console.log(totalContext)
            const entries = totalContext.entries()
            console.log("entries count " + totalContext.size)
            for (let entry of entries) {
                console.log(entry[0])
                console.log(entry[1])
            }
        }
    }, [])

    useEffect(() => {
        console.log("++++++++++++++")
        if (recentMeatInfo === undefined) {
            console.error("recentMeatInfo : undefined")
            return
        }
        console.log(recentMeatInfo)
        let tempMap = new Map([...dummyHash])
        tempMap.forEach((value, key) => {
            if (key == `${recentMeatInfo.meatNumber}${recentMeatInfo.price}`) {
                tempMap.delete(key)
            }
        })
        tempMap.set(recentMeatInfo.meatNumber!!, recentMeatInfo)
        console.log(tempMap)
        setDHash(tempMap)
    }, [recentMeatInfo])

    return (
        <div>
            <Toaster />
            <Button onClick={() => toast.success("쓰러갑시다")}>버튼</Button>
            <Stack gap={2}>
                <h5>전부 입력하기 전에 못 내리신다고</h5>
                {Array.from(dummyHash.values()).map(
                    (item: MeatInfoWithCount) => {
                        return (
                            <EditCard
                                key={item.meatNumber!! + item.price}
                                meatInfo={item}
                                clickEvent={() => {
                                    setShow(!show)
                                    setCurrentSpecies(item.species)
                                    setRecentMeatInfo(item)
                                }}
                            />
                        )
                    }
                )}
            </Stack>

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
