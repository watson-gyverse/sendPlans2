import { useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { TotalMeatLineContext } from "../../contexts/meatLineContext"
import { EditCard } from "../../components/editCard"
import { Button, Modal, Stack } from "react-bootstrap"
import EditModal from "../../components/editModal"
import { MeatInfo } from "../../utils/types/meatTypes"
import { dummys } from "../../utils/consts/meat"

const dummyCount = 2
export default function EditScreen() {
    const { totalContext, setTotalContext } = useContext(TotalMeatLineContext)
    const [cardData, setCardData] = useState<Map<MeatInfo, number>>()
    const [show, setShow] = useState(false)
    const [currentSpecies, setCurrentSpecies] = useState<string>("")

    const [recentModifiedMeatInfo, setRecentMeatInfo] = useState<MeatInfo>()
    const [tempPrice, setTempPrice] = useState<number>()
    const [tempOrigin, setTempOrigin] = useState<string>()
    const [tempGrade, setTempGrade] = useState<string>()
    const [tempGender, setTempGender] = useState<string>()
    const [tempFreeze, setTempFreeze] = useState<string>()

    useEffect(() => {
        // toast("하이요")
        if (totalContext != null) {
            console.log(totalContext)
            const entries = totalContext.entries()
            for (let entry of entries) {
                console.log(entry[0])
                console.log(entry[1])
            }
        }
    }, [])
    return (
        <div>
            <Toaster />
            <Button onClick={() => toast.success("쓰러갑시다")}>버튼</Button>
            <Stack gap={2}>
                <h5>전부 입력하기 전에 못 내리신다고</h5>
                {dummys.map((dummy) => {
                    return (
                        <EditCard
                            key={dummy.meatNumber}
                            meatInfo={dummy}
                            clickEvent={() => {
                                setShow(!show)
                                setCurrentSpecies(dummy.species)
                            }}
                            count={dummyCount}
                        />
                    )
                })}
            </Stack>
            <Modal
                show={show}
                onHide={() => setShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>고기 정보 입력/수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditModal
                        species={currentSpecies}
                        setPrice={setTempPrice}
                        setOrigin={setTempOrigin}
                        setGender={setTempGender}
                        setGrade={setTempGrade}
                        setFreeze={setTempFreeze}
                    />
                </Modal.Body>
            </Modal>
        </div>
    )
}
