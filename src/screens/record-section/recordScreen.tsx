import { Button, Collapse } from "react-bootstrap"
import {
    Filter,
    FilterProperties,
} from "../../components/record-section/filter"
import { useEffect, useState } from "react"
import { MeatInfoAiO } from "../../utils/types/meatTypes"
import { useNavigate } from "react-router-dom"

export default function RecordScreen() {
    const navigate = useNavigate()
    const [filterOpen, setFilterOpen] = useState(true)

    //filter
    const [currentPlace, setPlace] = useState("")
    const [activeFridge, setActiveFridge] = useState<number[]>([])
    const [activeFloor, setActiveFloor] = useState<number[]>([1, 2, 3, 4, 5])
    const [activeSpecies, setActiveSpecies] = useState<string[]>(["소", "돼지"])

    const filterSet: FilterProperties = {
        currentPlace: currentPlace,
        setPlace: setPlace,
        activeFridge: activeFridge,
        setActiveFridge: setActiveFridge,
        activeFloor: activeFloor,
        setActiveFloor: setActiveFloor,
        activeSpecies: activeSpecies,
        setActiveSpecies: setActiveSpecies,
    }

    const [records, setRecords] = useState<MeatInfoAiO[]>([])
    const [filteredRecords, setFRecords] = useState<MeatInfoAiO[]>([])
    const onfilterOpenClick = () => {
        setFilterOpen(!filterOpen)
    }
    // const [places, setPlaces] = useState<FirestorePlace[]>([])

    const onClickBack = () => {
        navigate("../")
    }
    return (
        <div style={{ backgroundColor: "#f0c861" }}>
            <Button onClick={onClickBack}>뒤로</Button>
            <p>recordScreen</p>
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#aaaaf7",
                }}
            >
                <Button
                    onClick={onfilterOpenClick}
                    aria-controls='filterCollapse'
                    // aria-expanded={filterOpen}
                >
                    필터
                </Button>
                <Collapse in={filterOpen}>
                    <div id='filterCollapse'>
                        <Filter package={filterSet} />
                    </div>
                </Collapse>
            </div>

            <div style={{ height: "2000px", backgroundColor: "#fa6969" }}>
                <h6>{activeFridge}</h6>
                <h6>{activeFloor}</h6>
                <h6>{activeSpecies}</h6>
                {records.map((item) => (
                    <h6 key={item.docId}>{item.docId}</h6>
                ))}
            </div>
        </div>
    )
}
