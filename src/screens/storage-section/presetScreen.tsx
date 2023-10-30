import { Button, ButtonGroup, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { BeefCuts, PorkCuts } from "../../utils/consts/meat"
import DatePickerComponent from "../../components/storage-section/datePicker"
import toast, { Toaster } from "react-hot-toast"
import { sessionKeys } from "../../utils/consts/constants"
import { CurrentScanTextContext } from "../../contexts/meatLineContext"

export default function PresetScreen() {
    const { scanText, setScanText } = useContext(CurrentScanTextContext)
    const [date, setDate] = useState(new Date())
    const [species, setSpecies] = useState("돼지")
    const [cutList, setCutList] = useState<string[]>(PorkCuts)
    const [cut, setCut] = useState("")

    const session = sessionStorage
    const navigate = useNavigate()

    const goToCameraScreen = () => {
        if (cut == "") {
            console.log("안돼요")
            toast("부위도 골라주세요")
        } else {
            console.log(date + "카메라로" + species + " " + cut)

            session.setItem(
                sessionKeys.storageDate,
                date.toLocaleDateString("ko-KR")
            )
            session.setItem(sessionKeys.storageSpecies, species)
            session.setItem(sessionKeys.storageCut, cut)

            navigate("../camera")
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
        let tempDate = session.getItem(sessionKeys.storageDate)
        let tempSpecies = session.getItem(sessionKeys.storageSpecies)
        let tempCut = session.getItem(sessionKeys.storageCut)
        if (tempDate != null) setDate(new Date(tempDate))
        if (tempSpecies != null) setSpecies(tempSpecies)
        if (tempCut != null) setCut(tempCut)
        session.setItem("scanText", "initiated")
        setScanText("initiated")
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
