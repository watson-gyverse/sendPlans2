import { Button, ButtonGroup, Stack, ToggleButton } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { BeefCuts, PorkCuts } from "../../utils/consts/meat"
import toast, { Toaster } from "react-hot-toast"
import { sessionKeys } from "../../utils/consts/constants"
import { CurrentScanTextContext } from "../../contexts/meatLineContext"
import moment from "moment"
import { backgroundColors, fontColors } from "../../utils/consts/colors"
import { DatePickerSet } from "../../components/common/datePickerSet"

export default function PresetScreen() {
    const { scanText, setScanText } = useContext(CurrentScanTextContext)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date().getHours())
    const [species, setSpecies] = useState("돼지")
    const [cutList, setCutList] = useState<string[]>(PorkCuts)
    const [cut, setCut] = useState("")
    const [amPm, setAmPm] = useState(false) //true : am , false : pm

    const dateData = {
        date: date,
        setDate: setDate,
        time: time,
        setTime: setTime,
        amPm: amPm,
        setAmPm: setAmPm,
        variant: "primary",
    }
    const session = sessionStorage
    const navigate = useNavigate()

    const goToCameraScreen = () => {
        if (cut == "") {
            toast("부위도 골라주세요")
        } else {
            session.setItem(
                sessionKeys.storageDate,
                moment(date).format("YYYY-MM-DD ") +
                    (amPm ? time : time + 12).toString().padStart(2, "0")
                // date.toLocaleDateString("ko-KR")
            )
            session.setItem(sessionKeys.storageSpecies, species)
            session.setItem(sessionKeys.storageCut, cut)

            navigate("../camera")
        }
    }

    const onSpeciesChanged = (e: any) => {
        setSpecies(e.target.value)
        setCut("")
    }
    const onCutChanged = (e: any) => {
        setCut(e.target.value)
    }

    useEffect(() => {
        let tempDate = session.getItem(sessionKeys.storageDate)
        let tempSpecies = session.getItem(sessionKeys.storageSpecies)
        let tempCut = session.getItem(sessionKeys.storageCut)
        if (tempDate != null && !Number.isNaN(new Date(tempDate).getTime()))
            setDate(new Date(tempDate))
        if (tempSpecies != null) setSpecies(tempSpecies)
        if (tempCut != null) setCut(tempCut)
        session.setItem("scanText", "undefined")
        setScanText("undefined")
        session.setItem(sessionKeys.storageItems, "")
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
            <Button
                variant='primary'
                onClick={() => navigate("../../")}
            >
                뒤로
            </Button>

            <Stack
                gap={1}
                style={{
                    marginTop: "20px",
                    zIndex: "2",
                    position: "relative",
                    backgroundColor: backgroundColors.storage,
                    borderRadius: "20px",
                    padding: "12px",
                }}
            >
                <h2>언제 입고되었나요?</h2>

                <DatePickerSet dateData={dateData} />
            </Stack>
            <div style={{ height: "1rem" }}></div>
            <Stack
                gap={1}
                style={{
                    zIndex: "1",
                    position: "relative",
                    backgroundColor: backgroundColors.storage,
                    borderRadius: "20px",
                    padding: "12px",
                }}
            >
                <h2>어떤 고기인가요?</h2>
                <ButtonGroup>
                    {["돼지", "소"].map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`species-${idx}`}
                            value={radio}
                            type='radio'
                            variant='primary'
                            checked={radio === species}
                            onChange={onSpeciesChanged}
                            style={{
                                fontSize: "1.3rem",
                            }}
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
                            variant='outline-primary'
                            checked={radio === cut}
                            onChange={onCutChanged}
                            style={{
                                fontSize: "1.3rem",
                                color: fontColors.storage,
                                // backgroundColor: "white",
                            }}
                        >
                            {radio}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Stack>
            <div style={{ height: "4px" }}></div>
            <Button
                style={{
                    width: "5rem",
                    height: "3rem",
                    fontSize: "1.2rem",
                }}
                variant='primary'
                onClick={goToCameraScreen}
            >
                다음
            </Button>
        </div>
    )
}
