import { Button, ButtonGroup, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { BeefCuts, PorkCuts } from "../../utils/consts/meat"
import DatePickerComponent from "../../components/storage-section/datePicker"
import { CurrentMeatLineContext } from "../../contexts/meatLineContext"
import { MeatInfo, MeatPreset } from "../../utils/types/meatTypes"
import toast, { Toaster } from "react-hot-toast"

export default function PresetScreen() {
    const [date, setDate] = useState(new Date())
    const [species, setSpecies] = useState("돼지")
    const [cutList, setCutList] = useState<string[]>(PorkCuts)
    const [cut, setCut] = useState("")

    const { currentContext, setCurrentContext } = useContext(
        CurrentMeatLineContext
    )

    const navigate = useNavigate()
    const goToCameraScreen = () => {
        if (cut == "") {
            console.log("안돼요")
            toast("부위도 골라주세요")
        } else {
            console.log(date + "카메라로" + species + " " + cut)
            let thisPreset: MeatPreset = {
                storedDate: date,
                species: species,
                cut: cut,
            }
            let meatInfo: MeatInfo = {
                ...thisPreset,
                meatNumber: null,
                origin: null,
                //아래는 소만 스캔되고, 돼지는 직접 기입
                gender: null,
                grade: null,
                freeze: null,
                price: null,
                beforeWeight: null,
                // fridgeNumber: null,
                // storageNumber: null,
                entryNumber: null,
            }
            setCurrentContext(meatInfo)

            navigate("../camera", {
                state: {
                    date: date,
                    species: species,
                    cut: cut,
                },
            })
        }
    }

    const onSpeciesChanged = (e: any) => {
        setSpecies(e.target.value)
        setCut("")
        console.log(e.target.value)
    }
    const onCutChanged = (e: any) => {
        setCut(e.target.value)
        console.log(e.target.value)
    }

    useEffect(() => {
        if (currentContext != null) {
            setDate(currentContext.storedDate)
            setSpecies(currentContext.species)
            setCut(currentContext.cut)
        }
    }, [])

    useEffect(() => {
        if (species === "소") {
            setCutList(BeefCuts)
        } else {
            setCutList(PorkCuts)
        }
    }, [species])
    return (
        <div
            style={{
                padding: "1rem",
            }}
        >
            <Toaster
                position='top-center'
                reverseOrder={false}
            />
            <Stack
                gap={1}
                style={{ zIndex: "2", position: "relative" }}
            >
                <h2>언제 입고되었나요?</h2>
                <DatePickerComponent
                    targetDate={date}
                    setTargetDate={setDate}
                />
            </Stack>
            <div style={{ height: "3rem" }}></div>
            <Stack
                gap={1}
                style={{ zIndex: "1", position: "relative" }}
            >
                <h2>어떤 고기인가요?</h2>
                <ButtonGroup>
                    {["돼지", "소"].map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`species-${idx}`}
                            value={radio}
                            type='radio'
                            variant='outline-success'
                            checked={radio === species}
                            onChange={onSpeciesChanged}
                            style={{ fontSize: "1.3rem" }}
                        >
                            {radio}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
                <ButtonGroup
                    vertical={true}
                    defaultValue={""}
                    size='sm'
                >
                    {cutList.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`cut-${idx}`}
                            value={radio}
                            type='radio'
                            variant='outline-success'
                            checked={radio === cut}
                            onChange={onCutChanged}
                            style={{
                                fontSize: "1.3rem",
                            }}
                        >
                            {radio}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Stack>
            <div style={{ height: "4px" }}></div>
            <Button
                style={{ width: "5rem", height: "3rem", fontSize: "1.2rem" }}
                variant='primary'
                onClick={goToCameraScreen}
            >
                다음
            </Button>
        </div>
    )
}
