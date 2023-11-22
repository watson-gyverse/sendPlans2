import { Button, Collapse } from "react-bootstrap"
import {
    Filter,
    FilterProperties,
} from "../../components/record-section/filter"
import { useEffect, useState } from "react"
import { MeatInfo, MeatInfoAiO } from "../../utils/types/meatTypes"
import { useNavigate } from "react-router-dom"
import _ from "lodash"
import useFBFetch from "../../hooks/useFetch"
import { fbCollections } from "../../utils/consts/constants"

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
                {/* <h6>{activeFridge}</h6>
                <h6>{activeFloor}</h6>
                <h6>{activeSpecies}</h6> */}
                {showingRecords.map((item) => (
                    // <div>
                    //     <h6 key={item.docId}>{item.docId}</h6>
                    // </div>
                    <div
                        style={{
                            backgroundColor: "#ffdaec",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <h6>이력번호: {item.meatNumber}</h6>
                            <button>자세히</button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",

                                justifyContent: "space-evenly",
                            }}
                        >
                            <div>
                                <h6>입고시각 </h6>
                                <h6>{item.storedDate}</h6>
                                <h6>숙성시작 </h6>
                                <h6>{item.agingDate}</h6>
                                <h6>숙성종료 </h6>
                                <h6>{item.finishDate}</h6>
                            </div>
                            <div>
                                <h6>
                                    {item.species} / {item.cut}
                                </h6>
                                <h6>
                                    {item.origin} / {item.grade}
                                </h6>
                                <h6>무게(입고/숙성/손질)</h6>
                                <h6>
                                    {item.beforeWeight} / {item.afterWeight} /{" "}
                                    {item.cutWeight}
                                </h6>
                                <h6>무게변화율</h6>
                                <h6> -10% / -6%</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
