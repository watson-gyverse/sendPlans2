import { Button, FloatingLabel, Form, Modal, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { addPlace, deletePlace, getPlaces } from "../../apis/agingApi"
import { FirestorePlace } from "../../utils/types/otherTypes"
import { AiFillSetting } from "react-icons/ai"
import { TiDelete, TiDeleteOutline } from "react-icons/ti"
import { CgAdd } from "react-icons/cg"
import toast, { Toaster } from "react-hot-toast"
import { PlaceCard } from "../../components/aging-section/placeCard"
export default function PlaceScreen() {
    const navigate = useNavigate()
    const [places, setPlaces] = useState<FirestorePlace[]>([])
    const [isEditMode, setEditMode] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    const [placeName, setPlaceName] = useState("")
    const [fridgeCount, setFridgeCount] = useState("")

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setPlaceName(e.target.value)
    }
    const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFridgeCount(e.target.value)
    }

    useEffect(() => {
        getPlaces(setPlaces)
    }, [])

    function onPlaceClick(place: FirestorePlace) {
        if (isEditMode) return
        console.log(place)
        navigate("fetch", {
            state: {
                placeName: place.name,
                placeCount: place.count,
            },
        })
    }

    const onClickSetting = () => {
        setEditMode(!isEditMode)
    }

    const onDeleteClick = (id: string) => {
        const ok = window.confirm("삭제합니다? 진짜?")
        if (ok) {
            deletePlace(id, setPlaces)
        }
    }

    const onAddButtonClick = () => {
        setModalShow(true)
    }

    const onSubmitPlace = () => {
        if (Number(fridgeCount) < 1) {
            toast("냉장고 대수가 이상해요")
            return
        }

        addPlace(placeName, fridgeCount, setPlaces)
        setModalShow(false)
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                paddingTop: "30px",
                paddingBottom: "30px",
                backgroundColor: "#dde7a4",
                justifyContent: "center",
            }}
        >
            <Toaster />
            <AiFillSetting
                style={{ width: "30px", height: "30px" }}
                onClick={onClickSetting}
            />
            <Stack
                gap={3}
                style={{
                    alignItems: "center",
                }}
            >
                {places.map((item) => (
                    <PlaceCard
                        placeItem={item}
                        isEditMode={isEditMode}
                        onDeleteClick={() => onDeleteClick(item.id!!)}
                        onPlaceClick={() => onPlaceClick(item)}
                    />
                ))}
                {isEditMode ? (
                    <Button
                        onClick={onAddButtonClick}
                        style={
                            { height: "4rem", width: "260px" }
                            // borderRadius: "20px",
                            // border: "1px solid black",
                        }
                    >
                        <CgAdd style={{ width: "30px", height: "30px" }} />
                    </Button>
                ) : (
                    <></>
                )}
            </Stack>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size='sm'
            >
                <Modal.Header closeButton>장소 추가</Modal.Header>
                <Modal.Body>
                    <h6>장소명:</h6>
                    <input
                        type='text'
                        onChange={onNameChange}
                    />
                    <h6 style={{ marginTop: "10px" }}>냉장고 개수:</h6>
                    <input
                        type='number'
                        onChange={onCountChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onSubmitPlace}>제출</Button>
                    <Button onClick={() => setModalShow(false)}>취소</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
