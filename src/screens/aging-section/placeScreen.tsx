import { Button, Stack } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getPlaces } from "../../apis/agingApi"
import { FirestorePlace } from "../../utils/types/otherTypes"

export default function PlaceScreen() {
    const navigate = useNavigate()
    const [places, setPlaces] = useState<FirestorePlace[]>([])
    useEffect(() => {
        getPlaces(setPlaces)
    }, [])

    function onPlaceClick(place: FirestorePlace) {
        console.log(place)
        navigate("fetch", {
            state: {
                placeName: place.name,
                placeCount: place.count,
            },
        })
    }

    return (
        <div style={{ paddingTop: "30px", paddingBottom: "30px" }}>
            <Stack gap={3}>
                {places.map((item) => {
                    return (
                        <Button
                            key={item.name + item.count}
                            style={{ height: "4rem" }}
                            onClick={() => onPlaceClick(item)}
                        >
                            {item.name}
                        </Button>
                    )
                })}
            </Stack>
        </div>
    )
}
