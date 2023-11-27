import { Button, Collapse } from "react-bootstrap"
import {
    Filter,
    FilterProperties,
} from "../../components/record-section/filter"
import { useEffect, useState } from "react"
import { MeatInfoAiO } from "../../utils/types/meatTypes"
import { useNavigate } from "react-router-dom"
import _ from "lodash"
import useFBFetch from "../../hooks/useFetch"
import { fbCollections } from "../../utils/consts/constants"
import { RecordCard } from "../../components/record-section/recordCard"

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

    const data = useFBFetch<MeatInfoAiO>(fbCollections.sp2Record).data
    const [records, setRecords] = useState<MeatInfoAiO[]>([])
    const [showingRecords, setShowingRecords] = useState<MeatInfoAiO[]>([])
    const [filteredRecords, setFRecords] = useState<MeatInfoAiO[]>([])
    const onfilterOpenClick = () => {
        setFilterOpen(!filterOpen)
    }
    // const [places, setPlaces] = useState<FirestorePlace[]>([])

    const onClickBack = () => {
        navigate("../")
    }

    useEffect(() => {
        setRecords(data)
    }, [data])

    useEffect(() => {
        const a = _.filter(records, (meatInfo: MeatInfoAiO) => {
            return (
                meatInfo.place === currentPlace &&
                _.includes(activeFridge, Number(meatInfo.fridgeName)) &&
                _.includes(activeFloor, Number(meatInfo.floor)) &&
                _.includes(activeSpecies, meatInfo.species)
            )
        })
        console.log(a)
        setShowingRecords(a)
    }, [records, activeFridge, activeFloor, activeSpecies, currentPlace])

    return (
        <div style={{ backgroundColor: "#f0d286", padding: "20px 10px" }}>
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f0d286ba",
                    padding: "6px 4px",
                }}
            >
                <Button
                    variant='warning'
                    onClick={onClickBack}
                >
                    뒤로
                </Button>
                <Button
                    variant='warning'
                    style={{ marginLeft: "20px" }}
                    onClick={onfilterOpenClick}
                    aria-controls='filterCollapse'
                    // aria-expanded={filterOpen}
                >
                    필터
                </Button>
                <Collapse in={filterOpen}>
                    <div
                        id='filterCollapse'
                        style={{
                            backgroundColor: "#edc86c",
                            padding: "6px 4px",
                            marginTop: "10px",
                        }}
                    >
                        <Filter package={filterSet} />
                    </div>
                </Collapse>
            </div>

            <div style={{ height: "2000px" }}>
                {showingRecords.map((item) => (
                    <div>
                        <RecordCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    )
}
