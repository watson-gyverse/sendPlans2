import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Spinner, Stack } from "react-bootstrap"
import { Html5QrcodeResult, Html5QrcodeError } from "html5-qrcode/esm/core"
import Html5QrcodePlugin from "../../components/storage-section/qrScanPlugin"
import { MeatInfoWithCount, MeatScanned } from "../../utils/types/meatTypes"
import { ScanResultBox } from "../../components/storage-section/scanResultBox"
import { getForeignMeatInfo, getMeatInfo } from "../../apis/meatApi"
import toast, { Toaster } from "react-hot-toast"
import { sessionKeys } from "../../utils/consts/constants"
import * as _ from "lodash"
import { ScanResultCart } from "../../components/storage-section/scanResultCart"
import { CurrentScanTextContext } from "../../contexts/meatLineContext"

export default function CameraScreen() {
    const { scanText, setScanText } = useContext(CurrentScanTextContext)

    const [failToGetMeatInfo, setFailedGetMeatInfo] = useState(false)
    const [wrongCut, setWrongCut] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [isButtonEnabled, setButtonEnable] = useState(false)

    const navigate = useNavigate()
    const session = sessionStorage
    const initItems = session.getItem(sessionKeys.storageItems)
    const parsed: MeatInfoWithCount[] = JSON.parse(initItems ? initItems : "[]")
    const [items, setItems] = useState<MeatInfoWithCount[]>(parsed)
    const species = session.getItem(sessionKeys.storageSpecies)
    const [scanSpecies, setScanSpecies] = useState<string>(
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
        toast.success("스캔 성공")
        console.log("before: " + scanText)
        console.log("after " + decodedText)

        if (decodedText === "") return
        if (
            decodedText.length !== 12 &&
            decodedText.length !== 15 &&
            decodedText.charAt(0) !== ("0" || "1" || "8" || "9" || "L")
        ) {
            console.log("이력번호가 아닙니다")
            setLoadingState(0)
            return
        }

        //새로운 스캔텍스트
        if (scanText !== decodedText) {
            let alreadyExist = false
            _.forEach(items, (item) => {
                if (item.meatNumber === scanText) {
                    item.count++
                    alreadyExist = true
                    return false
                }
            })
            if (!alreadyExist && scanText !== "undefined") {
                console.log("중복이 있음")
                setItems(items)
                setLoadingState(0)
            }
        }
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
        session.setItem(sessionKeys.storageItems, JSON.stringify(items))
        navigate("/storage/edit")
    }
    useEffect(() => {
        if (
            (scanText.length === 12 || scanText.length === 15) &&
            loadingState === 0
        ) {
            setLoadingState(1)
            if (scanText.charAt(0) === "8" || scanText.charAt(0) === "9") {
                getForeignMeatInfo(
                    scanText,
                    setGrade,
                    setScanSpecies,
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
                    setScanSpecies,
                    setGender,
                    setOrigin,
                    setLoadingState,
                    setFailedGetMeatInfo,
                    setWrongCut
                )
            }
        } else {
            console.warn("wander")
            console.log(scanText)
            console.log(loadingState)
            setLoadingState(0)
        }
    }, [scanText])

    useEffect(() => {
        switch (loadingState) {
            //초기화
            case 0: {
                setShowLoading(false)
                setButtonEnable(false)
                break
            }
            //로딩중
            case 1: {
                setShowLoading(true)
                setButtonEnable(false)
                break
            }
            //추가가능
            case 2: {
                setShowLoading(false)
                setButtonEnable(!wrongCut)
                break
            }
        }
    }, [loadingState])

    useEffect(() => {
        setScanText("initial")
        setScanSpecies(species ? species : "")
        setGrade("-")
        setGender("-")
        setWrongCut(false)
        setLoadingState(0)
    }, [items])

    useEffect(() => {
        setWrongCut(scanSpecies !== species)
    }, [scanSpecies])

    const goToPreset = () => {
        navigate("/storage/preset")
    }
    return (
        <div>
            <Toaster />
            <div
                style={{
                    display: "center",
                    alignItems: "start",
                    marginBottom: "2rem",
                }}
            >
                <Button onClick={goToPreset}>뒤로</Button>
            </div>
            <Html5QrcodePlugin
                fps={1}
                qrbox={{ width: 250, height: 250 }}
                disableFlip={false}
                verbose={false}
                qrCodeSuccessCallback={onScanSuccess}
                qrCodeErrorCallback={onScanFailure}
                showTorchButtonIfSupported={true}
            />
            <h6>같은 번호는 아래에서 수량을 조절해주세요.</h6>
            <hr style={{ height: "2px" }} />
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
            <div
                style={{
                    display: wrongCut ? "flex" : "none",
                    justifyContent: "space-between",
                }}
            >
                <h6 style={{ color: "red" }}>
                    ※선택한 부위가 <br />
                    스캔한 육종과 맞지 않습니다!
                    <br />
                    다시 확인해주세요!!
                </h6>

                <Button
                    style={{ width: "auto" }}
                    onClick={goToPreset}
                >
                    돌아가기
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
                    disabled={!isButtonEnabled || wrongCut}
                    onClick={onAddButtonClick}
                >
                    {showLoading ? (
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
