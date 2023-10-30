import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Spinner, Stack } from "react-bootstrap"
import { Html5QrcodeResult, Html5QrcodeError } from "html5-qrcode/esm/core"
import Html5QrcodePlugin from "../../components/storage-section/qrScanPlugin"
import { MeatInfoWithCount, MeatScanned } from "../../utils/types/meatTypes"
import { ScanResultBox } from "../../components/storage-section/scanResultBox"
import { getForeignMeatInfo, getMeatInfo } from "../../apis/MeatApi"
import toast, { Toaster } from "react-hot-toast"
import { sessionKeys } from "../../utils/consts/constants"
import * as _ from "lodash"
import { ScanResultCart } from "../../components/storage-section/scanResultCart"
import { CurrentScanTextContext } from "../../contexts/meatLineContext"

export default function CameraScreen() {
    // const { currentContext, setCurrentContext } = useContext(
    //     CurrentMeatLineContext
    // )
    // const { totalContext, setTotalContext } = useContext(TotalMeatLineContext)

    const { scanText, setScanText } = useContext(CurrentScanTextContext)

    const [failToGetMeatInfo, setFailedGetMeatInfo] = useState(false)
    const [wrongCut, setWrongCut] = useState(false)
    // const [scanText, setScanText] = useState(currentScanText)
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [isButtonEnabled, setButtonEnable] = useState(false)

    const navigate = useNavigate()
    const session = sessionStorage
    const [items, setItems] = useState<MeatInfoWithCount[]>([])
    const species = session.getItem(sessionKeys.storageSpecies)
    // const [scanText, setScanText] = useState(session.getItem("scanText"))
    const [scanSpecies, setScanSpecie] = useState<string>(
        species ? species : ""
    )
    const [grade, setGrade] = useState<string>()
    const [gender, setGender] = useState<string>()
    const [origin, setOrigin] = useState<string>()

    const [show, setShow] = useState(false)
    const [loadingState, setLoadingState] = useState(0)

    const onScanSuccess = (
        decodedText: string,
        decodedResult: Html5QrcodeResult
    ) => {
        toast("스캔 성공")
        console.log("before: " + scanText)
        console.log("after " + decodedText)
        if (scanText !== decodedText) {
            let alreadyExist = false
            _.forEach(items, (item) => {
                if (item.meatNumber === scanText) {
                    item.count++
                    alreadyExist = true
                    return false
                }
            })
            if (!alreadyExist && scanText !== "initiated") {
                console.log("중복이 있음")
                setItems(items)
                setLoadingState(2)
            }
        }
        session.setItem("scanText", decodedText.trim())
        setScanText(decodedText.trim())
    }

    const onScanFailure = (errorMessage: string, error: Html5QrcodeError) => {
        console.warn(`Code scan error = ${error}`)
    }

    const onAddButtonClick = () => {
        setShow(!show)
        setLoadingState(0)

        let storedDate = session.getItem(sessionKeys.storageDate)
        let cut = session.getItem(sessionKeys.storageCut)
        let scanned: MeatScanned = {
            storedDate: storedDate!!,
            species: scanSpecies,
            cut: cut!!,
            meatNumber: scanText,
            origin: origin ? origin : null,
            gender: gender ? gender : null,
            grade: grade ? grade : null,
        }
        let meatInfo: MeatInfoWithCount = {
            ...scanned,
            freeze: null,
            price: null,
            beforeWeight: null,
            entryNumber: null,
            count: 1,
        }
        var alreadyExist = false

        _.forEach(items, (item) => {
            if (item.meatNumber === scanText) {
                item.count++
                alreadyExist = true
                return false
            }
        })
        if (!alreadyExist) {
            console.log("중복이 있음")
            setItems([...items, meatInfo])
        } else {
            setItems(items)
        }
        console.log("pushed")
        console.log(items)
    }

    const onNextButtonClicked = () => {
        // setTotalContext(hash)

        session.setItem(sessionKeys.storageItems, JSON.stringify(items))
        navigate("/submit/edit")
    }
    useEffect(() => {
        console.log("scantext touched")
        if (scanText === null) return
        if (scanText.length != 12 && scanText.length != 15) {
            console.log("이력번호가 아닙니다")
        } else if (
            (scanText.length == 12 || scanText.length == 15) &&
            loadingState == 0
        ) {
            setLoadingState(1)
            if (scanText.charAt(0) == "8" || scanText.charAt(0) == "9") {
                getForeignMeatInfo(
                    scanText,
                    setGrade,
                    setScanSpecie,
                    setGender,
                    setOrigin,
                    setLoadingState,
                    setFailedGetMeatInfo,
                    setWrongCut
                )
            } else {
                getMeatInfo(
                    scanText,
                    setGrade,
                    setScanSpecie,
                    setGender,
                    setOrigin,
                    setLoadingState,
                    setFailedGetMeatInfo,
                    setWrongCut
                )
            }
        } else {
            console.log("방황하는가")
        }
    }, [scanText])

    useEffect(() => {
        switch (loadingState) {
            //초기화
            case 0: {
                setLoadingInfo(false)
                setButtonEnable(false)
                break
            }
            //로딩중
            case 1: {
                setLoadingInfo(true)
                setButtonEnable(false)
                break
            }
            //추가가능
            case 2: {
                setLoadingInfo(false)
                if (!wrongCut) setButtonEnable(true)
                break
            }
        }
    }, [loadingState])

    useEffect(() => {
        setWrongCut(scanSpecies != species)
    }, [scanSpecies])

    const goToPreset = () => {
        navigate("/submit/preset")
    }
    return (
        <div>
            <Toaster />
            <div style={{ display: "center", alignItems: "start" }}>
                <Button onClick={goToPreset}>뒤로</Button>
            </div>
            <Stack className='border-1 rounded '>
                {/* <h6>{printKorDate(location.state.date)}</h6> */}
                {/* <h6>{location.state.species}</h6>
                <h6>{location.state.cut}</h6> */}
            </Stack>
            <Html5QrcodePlugin
                fps={1}
                qrbox={{ width: 250, height: 250 }}
                disableFlip={false}
                verbose={false}
                qrCodeSuccessCallback={onScanSuccess}
                qrCodeErrorCallback={onScanFailure}
                showTorchButtonIfSupported={true}
            />
            <h4> {"조회내역: "}</h4>
            <ScanResultBox
                meatNumber={scanText ? scanText : "null"}
                species={scanSpecies}
                grade={grade}
                gender={gender}
            />
            <h6
                style={{
                    color: "red",
                    display: failToGetMeatInfo ? "block" : "none",
                }}
            >
                ※이력번호 조회에 실패했습니다
            </h6>
            <div style={{ display: wrongCut ? "flex" : "none" }}>
                <h6 style={{ color: "red" }}>
                    ※선택한 부위가 육종과 맞지않습니다
                </h6>
                <Button
                    style={{ width: "auto" }}
                    onClick={goToPreset}
                >
                    뒤로
                </Button>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                }}
            >
                <Button
                    style={{ width: "8rem", height: "3rem" }}
                    disabled={!isButtonEnabled && !wrongCut}
                    onClick={onAddButtonClick}
                >
                    {loadingInfo ? (
                        <Spinner
                            animation='border'
                            size='sm'
                        />
                    ) : (
                        <>추가</>
                    )}
                </Button>
            </div>
            <hr style={{ height: "2px" }} /> <h4>바구니:</h4>
            <ScanResultCart
                items={items.sort(
                    (a, b) => Number(a.meatNumber) - Number(b.meatNumber)
                )}
                modifyItems={setItems}
            />
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
            >
                <Button
                    style={{ width: "8rem", height: "3rem" }}
                    disabled={items.length === 0}
                    onClick={onNextButtonClicked}
                >
                    다음
                </Button>
            </div>
        </div>
    )
}

const contextErrorMessage = () => {
    toast.error(
        "입력정보가 손상되었습니다\n이전화면으로 돌아가서\n다시 입력해주세요"
    )
}
