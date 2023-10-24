import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Spinner, Stack } from "react-bootstrap"
import { Html5QrcodeResult, Html5QrcodeError } from "html5-qrcode/esm/core"
import Html5QrcodePlugin from "../../components/storage-section/qrScanPlugin"
import {
    MeatInfo,
    MeatInfoWithCount,
    MeatScanned,
} from "../../utils/types/meatTypes"
import { ScanResultBox } from "../../components/storage-section/scanResultBox"
import { getForeignMeatInfo, getMeatInfo } from "../../apis/MeatApi"
import { ScanResultCart } from "../../components/storage-section/scanResultCart"
import {
    CurrentMeatLineContext,
    TotalMeatLineContext,
} from "../../contexts/meatLineContext"
import toast, { Toaster } from "react-hot-toast"
import { BeefCuts, PorkCuts } from "../../utils/consts/meat"

export default function CameraScreen() {
    const { currentContext, setCurrentContext } = useContext(
        CurrentMeatLineContext
    )
    const { totalContext, setTotalContext } = useContext(TotalMeatLineContext)
    const navigate = useNavigate()

    const [failToGetMeatInfo, setFailedGetMeatInfo] = useState(false)
    const [wrongCut, setWrongCut] = useState(false)
    const [scanText, setScanText] = useState("")
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [isButtonEnabled, setButtonEnable] = useState(false)

    const [hash, setHash] =
        useState<Map<string, MeatInfoWithCount>>(totalContext)

    const addHash = (key: string, value: MeatInfoWithCount) => {
        setHash((prev) => new Map([...prev, [key, value]]))
    }

    const upsertHash = (key: string, value: MeatInfoWithCount) => {
        setHash((prev) => new Map(prev).set(key, value))
    }

    useEffect(() => {
        console.log(hash)
    }, [hash])
    const [scanSpecies, setScanSpecie] = useState<string>("")
    const [grade, setGrade] = useState<string>()
    const [gender, setGender] = useState<string>()
    const [origin, setOrigin] = useState<string>()

    const [show, setShow] = useState(false)
    const [loadingState, setLoadingState] = useState(0)
    const onScanSuccess = (
        decodedText: string,
        decodedResult: Html5QrcodeResult
    ) => {
        setScanText(decodedText.trim())
    }

    const onScanFailure = (errorMessage: string, error: Html5QrcodeError) => {
        console.warn(`Code scan error = ${error}`)
    }

    const onAddButtonClick = () => {
        setShow(!show)
        setLoadingState(0)
        if (currentContext == null) {
            console.log("프리셋이 업서")
            contextErrorMessage()
        } else {
            console.log(currentContext)
            let { storedDate, species, cut } = currentContext!!

            let scanned: MeatScanned = {
                storedDate: storedDate,
                species: scanSpecies,
                cut: cut,
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
                // fridgeNumber: null,
                // storageNumber: null,
                entryNumber: null,
                count: 1,
            }
            const copiedMap = hash
            console.log(`${copiedMap}`)
            if (copiedMap.size == 0) {
                console.log("첫 아이템")
                upsertHash(meatInfo.meatNumber!!, meatInfo)
                return false
            }
            var a = false
            console.log("for전")
            for (let [meatnumber, meatinfo] of copiedMap) {
                const s1 = JSON.stringify(Object.entries(meatnumber).sort())
                const s2 = JSON.stringify(Object.entries(scanned).sort())
                console.log(`${meatnumber}`)
                console.log(`${meatinfo}`)
                console.log(`s1과 s2 ${meatnumber} ${scanned.meatNumber}`)
                console.log(`${s1}`)
                console.log(`${s2}`)

                if (s1 === s2) {
                    console.log("동일할 경우")
                    console.log(`${copiedMap}`)
                    const plus1 = Object.assign(meatinfo)
                    plus1.count = meatinfo.count + 1
                    addHash(meatnumber, plus1)
                    a = true
                }

                setCurrentContext(meatInfo)
            }
            if (!a) {
                console.log("넣습니다")
                console.log(scanned)
                addHash(scanText, meatInfo)
            }
        }
    }

    const onNextButtonClicked = () => {
        setTotalContext(hash)
        navigate("/submit/edit")
    }

    useEffect(() => {
        console.log("useEffect1")
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
        }
    }, [scanText])

    useEffect(() => {
        console.log("useEffect2")
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
                setButtonEnable(true)
                break
            }
        }
    }, [loadingState])

    useEffect(() => {
        console.log("useEffect3")
        if (currentContext == null) {
            contextErrorMessage()
        } else {
            if (scanSpecies === "소") {
                if (BeefCuts.indexOf(currentContext!!.cut) === -1) {
                    setWrongCut(true)
                    setLoadingState(0)
                }
            } else if (scanSpecies === "돼지") {
                if (PorkCuts.indexOf(currentContext!!.cut) === -1) {
                    setWrongCut(true)
                    setLoadingState(0)
                }
            }
        }
    }, [scanSpecies])

    const goToPreset = () => {
        navigate("/submit/preset")
    }
    return currentContext ? (
        <div>
            <Toaster />
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
                meatNumber={scanText}
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
                    뒤로가기
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
                    disabled={!isButtonEnabled}
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
            <hr style={{ height: "2px" }} /> <h4>장바구니</h4>
            <ScanResultCart
                items={hash}
                modifyHash={setHash}
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
                    disabled={hash.size === 0}
                    onClick={onNextButtonClicked}
                >
                    다음
                </Button>
            </div>
        </div>
    ) : (
        <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <h5>사전 정보가 입력되지 않았습니다</h5>
            <Button
                style={{ padding: "10px" }}
                href='/submit/preset'
            >
                입고화면으로 가기
            </Button>
        </div>
    )
}

const contextErrorMessage = () => {
    toast.error(
        "입력정보가 손상되었습니다\n이전화면으로 돌아가서\n다시 입력해주세요"
    )
}
