import { TiDeleteOutline } from "react-icons/ti"
import { FirestorePlace } from "../../utils/types/otherTypes"
import { Button } from "react-bootstrap"

type PlaceCardType = {
    placeItem: FirestorePlace
    isEditMode: boolean
    onDeleteClick: (id: string) => void
    onPlaceClick: (place: FirestorePlace) => void
}

export function PlaceCard(info: PlaceCardType) {
    const { placeItem, isEditMode, onDeleteClick, onPlaceClick } = info
    const buttonStyle = {
        height: "4rem",
        width: "260px",
    }
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
            }}
        >
            <TiDeleteOutline
                style={{
                    display: isEditMode ? "flex" : "none",
                    width: "30px",
                    height: "30px",
                    color: "#f74f32",
                }}
                onClick={() => onDeleteClick(placeItem.id!!)}
            />
            <Button
                key={placeItem.name + placeItem.count}
                style={buttonStyle}
                onClick={() => onPlaceClick(placeItem)}
            >
                {placeItem.name}
            </Button>
        </div>
    )
}
