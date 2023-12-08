import { FirestorePlace } from "../../utils/types/otherTypes"
import { useEffect, useState } from "react"
import _ from "lodash"
import useFBFetch from "../../hooks/useFetch"
import { fbCollections } from "../../utils/consts/constants"
import { makeStepArray } from "../../utils/consts/functions"
import DatePickerComponent from "../storage-section/datePicker"
import { MeatInfoAiO } from "../../utils/types/meatTypes"

type FilterProps = {
    data: MeatInfoAiO[]
    setFilteredRecords: React.Dispatch<React.SetStateAction<MeatInfoAiO[]>>
    places: FirestorePlace[]
}

export const Filter = (props: FilterProps) => {
    const { data, setFilteredRecords, places } = props
    const [currentPlace, setPlace] = useState("")
    const [activeFridge, setActiveFridge] = useState<number[]>([])
    const [activeFloor, setActiveFloor] = useState<number[]>([1, 2, 3, 4, 5])
    const [activeSpecies, setActiveSpecies] = useState<string[]>(["소", "돼지"])

    const now = new Date()
    const amonthAgo = new Date()
    amonthAgo.setMonth(new Date().getMonth() - 1)
    const [storageFromDate, setSFDate] = useState(amonthAgo)
    const [storageToDate, setSTDate] = useState(now)
    const [agingFromDate, setAFDate] = useState(amonthAgo)
    const [agingToDate, setATDate] = useState(now)
    const [finishFromDate, setFFDate] = useState(amonthAgo)
    const [finishToDate, setFTDate] = useState(now)

    const [currentFirebasePlace, setFbPlace] = useState(places[0])
    const [currentFridges, setFridges] = useState<number[]>([]) //깔아줄 냉장고, active와 비교

    useEffect(() => {
        if (places.length !== 0) {
            let f = places[0]
            let a = makeStepArray(Number(f.count))
            setPlace(f.name)
            setFbPlace(f)
            setFridges(a)
            setActiveFridge(a)
        }
    }, [places])

    useEffect(() => {
        const a = _.filter(data, (item: MeatInfoAiO) => {
            const sf = new Date(storageFromDate).getTime()
            const st = new Date(storageToDate).getTime()
            const af = new Date(agingFromDate).getTime()
            const at = new Date(agingToDate).getTime()
            const ff = new Date(finishFromDate).getTime()
            const ft = new Date(finishToDate).getTime()

            const sSplit = item.storedDate.split(" ")
            const aSplit = item.agingDate!!.split(" ")
            const fSplit = item.finishDate.split(" ")
            const sd = new Date(sSplit[0]).getTime()
            const ad = new Date(aSplit[0]).getTime()
            const fd = new Date(fSplit[0]).getTime()

            console.log(sd, sf, st, ad, af, at, fd, ff, ft)
            return (
                item.place === currentPlace &&
                _.includes(activeFridge, Number(item.fridgeName)) &&
                _.includes(activeFloor, Number(item.floor)) &&
                _.includes(activeSpecies, item.species) &&
                sd >= sf &&
                sd <= st &&
                ad >= af &&
                ad <= at &&
                fd >= ff &&
                fd <= ft
            )
        })

        console.log(a)
        setFilteredRecords(a)
    }, [
        data,
        activeFridge,
        activeFloor,
        activeSpecies,
        currentPlace,
        storageFromDate,
        storageToDate,
        agingFromDate,
        agingToDate,
        finishFromDate,
        finishToDate,
    ])

    useEffect(() => {
        if (currentFirebasePlace !== undefined) {
            let b = makeStepArray(Number(currentFirebasePlace.count))
            setFridges(b)

            if (activeFridge.length > Number(currentFirebasePlace.count)) {
                setActiveFridge(b)
            }
        }
    }, [currentFirebasePlace])

    let isActive = (i: number, list: number[]) => {
        return _.includes(list, i)
    }
    const onClickFridge = (i: number) => {
        console.log(i, activeFridge)
        onClickFilter(i, activeFridge, setActiveFridge)
    }

    const onClickFloor = (i: number) => {
        console.log(i, activeFloor)
        onClickFilter(i, activeFloor, setActiveFloor)
    }

    const onClickSpecies = (i: string) => {
        onClickFilter(i, activeSpecies, setActiveSpecies)
    }

    const isEqual = (a: number[], b: number[]) => {
        return _.isEqual(a, b)
    }

    const categoryStyle = { margin: "4px 0 2px 2px" }
    return (
        <div
            style={{ display: "flex", flexDirection: "column", padding: "4px" }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                }}
            >
                <h6 style={categoryStyle}>장소</h6>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {places.map((place) => {
                        return (
                            <button
                                style={{
                                    backgroundColor:
                                        place.name === currentPlace
                                            ? "#cc81f2"
                                            : "#eabcff",
                                }}
                                value={place.count}
                                onClick={() => {
                                    setFbPlace(place)
                                    setPlace(place.name)
                                }}
                            >
                                {place.name}
                            </button>
                        )
                    })}
                </div>
                <h6 style={categoryStyle}>냉장고</h6>
                <div>
                    <button
                        style={{
                            backgroundColor: isEqual(
                                activeFridge,
                                currentFridges
                            )
                                ? "#cc81f2"
                                : "#eabcff",
                        }}
                        onClick={() => {
                            setActiveFridge(
                                activeFridge.length ===
                                    Number(currentFirebasePlace.count)
                                    ? []
                                    : currentFridges
                            )
                        }}
                    >
                        전체
                    </button>
                    {currentFridges.map((i) => (
                        <button
                            style={{
                                backgroundColor: isActive(i, activeFridge)
                                    ? "#cc81f2"
                                    : "#eabcff",
                            }}
                            onClick={() => {
                                onClickFridge(i)
                            }}
                        >
                            {i}
                        </button>
                    ))}
                </div>
                <h6 style={categoryStyle}>층</h6>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <button
                        style={{
                            backgroundColor:
                                activeFloor.length === 5
                                    ? "#cc81f2"
                                    : "#eabcff",
                        }}
                        onClick={() => {
                            setActiveFloor(
                                activeFloor.length === 5 ? [] : [1, 2, 3, 4, 5]
                            )
                        }}
                    >
                        전체
                    </button>
                    {makeStepArray(5).map((i) => (
                        <button
                            style={{
                                backgroundColor: isActive(i, activeFloor)
                                    ? "#cc81f2"
                                    : "#eabcff",
                            }}
                            onClick={() => {
                                onClickFloor(i)
                            }}
                        >
                            {i}
                        </button>
                    ))}
                </div>
                <h6 style={{ margin: "4px 0 2px 0" }}>육종</h6>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <button
                        style={{
                            backgroundColor:
                                activeSpecies.length === 2
                                    ? "#cc81f2"
                                    : "#eabcff",
                        }}
                        onClick={() => {
                            setActiveSpecies(
                                activeSpecies.length === 2 ? [] : ["소", "돼지"]
                            )
                        }}
                    >
                        전체
                    </button>
                    <button
                        style={{
                            backgroundColor: _.includes(activeSpecies, "소")
                                ? "#cc81f2"
                                : "#eabcff",
                        }}
                        onClick={() => onClickSpecies("소")}
                    >
                        소
                    </button>
                    <button
                        style={{
                            backgroundColor: _.includes(activeSpecies, "돼지")
                                ? "#cc81f2"
                                : "#eabcff",
                        }}
                        onClick={() => onClickSpecies("돼지")}
                    >
                        돼지
                    </button>
                </div>
                <h6 style={categoryStyle}>입고일</h6>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ marginRight: "16px" }}>
                        <DatePickerComponent
                            targetDate={storageFromDate}
                            setTargetDate={setSFDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>

                    <>~</>

                    <div style={{ marginLeft: "16px" }}>
                        <DatePickerComponent
                            targetDate={storageToDate}
                            setTargetDate={setSTDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>
                </div>
                <h6 style={categoryStyle}>숙성시작일</h6>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ marginRight: "16px" }}>
                        <DatePickerComponent
                            targetDate={agingFromDate}
                            setTargetDate={setAFDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>

                    <>~</>

                    <div style={{ marginLeft: "16px" }}>
                        <DatePickerComponent
                            targetDate={agingToDate}
                            setTargetDate={setATDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>
                </div>
                <h6 style={categoryStyle}>숙성종료일</h6>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ marginRight: "16px" }}>
                        <DatePickerComponent
                            targetDate={finishFromDate}
                            setTargetDate={setFFDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>

                    <>~</>

                    <div style={{ marginLeft: "16px" }}>
                        <DatePickerComponent
                            targetDate={finishToDate}
                            setTargetDate={setFTDate}
                            variant='warning'
                            fontSize='1rem'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function onClickFilter<T>(i: T, list: T[], setter: (a: T[]) => void) {
    if (_.includes(list, i)) {
        let a = [..._.pull(list, i)]
        setter(a.sort())
    } else {
        setter([...list, i].sort())
    }
}
