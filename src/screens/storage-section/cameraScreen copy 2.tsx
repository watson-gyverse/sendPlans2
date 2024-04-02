import {useContext, useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Spinner} from "react-bootstrap"
import {Html5QrcodeResult, Html5QrcodeError} from "html5-qrcode/esm/core"
import Html5QrcodePlugin from "../../components/storage-section/qrScanPlugin"
import {MeatInfoWithCount, MeatScanned} from "../../utils/types/meatTypes"
import {ScanResultBox} from "../../components/storage-section/scanResultBox"
import {getForeignMeatInfo, getMeatInfo} from "../../apis/meatApi"
import toast, {Toaster} from "react-hot-toast"
import {sessionKeys} from "../../utils/consts/constants"
import * as _ from "lodash"
import {ScanResultCart} from "../../components/storage-section/scanResultCart"
import {StorageContext} from "../../contexts/meatLineContext"
import {backgroundColors} from "../../utils/consts/colors"
import useDidMountEffect from "../../hooks/useDidMountEffect"

export default function CameraScreen3() {
	const {scanText, setScanText} = useContext(StorageContext)

	const [forceEnabled, setForceEnable] = useState(false)

	const [showScanner, setShowScanner] = useState(true)
	const [manualNumber, setManualNumber] = useState("")

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
	const [scanSpecies, setScanSpecies] = useState<string>(species ? species : "")
	const [grade, setGrade] = useState<string>()
	const [gender, setGender] = useState<string>()
	const [origin, setOrigin] = useState<string>()

	const [show, setShow] = useState(false)
	const [loadingState, setLoadingState] = useState(false)

	const onScanSuccess = (
		decodedText: string,
		decodedResult?: Html5QrcodeResult,
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
			setLoadingState(false)
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
				setLoadingState(false)
			}
		}
		setScanText(decodedText.trim())
	}

	const onScanFailure = (errorMessage: string, error: Html5QrcodeError) => {
		console.warn(`Code scan error = ${error}`)
	}

	const onAddButtonClick = () => {
		setShow(!show)

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
		if ((scanText.length === 12 || scanText.length === 15) && !loadingState) {
			setLoadingState(true)

			if (scanText.charAt(0) === "8" || scanText.charAt(0) === "9") {
				getForeignMeatInfo(
					scanText,
					setGrade,
					setScanSpecies,
					setGender,
					setOrigin,
					setLoadingState,
					setFailedGetMeatInfo,
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
				)
			}
		} else {
			console.warn("wander")
			console.log(scanText)
			console.log(loadingState)
			setLoadingState(false)
		}
	}, [scanText])

	useEffect(() => {
		setShowLoading(loadingState)
		setButtonEnable(!wrongCut)
	}, [loadingState])

	useEffect(() => {
		setScanText("initial")
		setScanSpecies(species ? species : "")
		setGrade("-")
		setGender("-")
		setWrongCut(false)
		setLoadingState(false)
	}, [items])

	useEffect(() => {
		setWrongCut(scanSpecies !== species)
	}, [scanSpecies])

	useDidMountEffect(() => {
		console.log(`검색결과 ${failToGetMeatInfo}`)
		if (!failToGetMeatInfo) {
			return
		}
		const ok = window.confirm(
			"올바르지않은 이력번호로 보입니다\n그래도 진행하시겠습니까",
		)
		if (ok) {
			setForceEnable(true)
			setLoadingState(false)
		}
	}, [failToGetMeatInfo])

	useDidMountEffect(() => {
		console.log(`로딩: ${loadingState}`)
		console.log(
			`여부: ${
				!forceEnabled || (forceEnabled && (!isButtonEnabled || wrongCut))
			}`,
		)
		console.log(
			!forceEnabled || (forceEnabled && (!isButtonEnabled || wrongCut)),
		)
	}, [forceEnabled, isButtonEnabled, wrongCut])

	const goToPreset = () => {
		setFailedGetMeatInfo(false)
		setForceEnable(false)
		setWrongCut(false)
		setLoadingState(false)
		navigate("/storage")
	}
	return (
		<div
			style={{
				backgroundColor: backgroundColors.storage_back,
				padding: "20px 10px",
			}}>
			<Toaster />
			<div
				style={{
					display: "flex",
					// alignItems: "start",
					marginBottom: "2rem",
					justifyContent: "space-between",
				}}>
				<Button onClick={goToPreset}>뒤로</Button>
				<Button onClick={() => setShowScanner(!showScanner)}>직접 입력</Button>
			</div>
			{showScanner ? (
				<div style={{backgroundColor: "#fafafa"}}>
					{" "}
					<Html5QrcodePlugin
						fps={1}
						qrbox={{width: 250, height: 250}}
						disableFlip={false}
						verbose={false}
						qrCodeSuccessCallback={onScanSuccess}
						qrCodeErrorCallback={onScanFailure}
						showTorchButtonIfSupported={true}
					/>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}>
					<label htmlFor="뽀삐">이력 번호</label>
					<input
						type="text"
						name="뽀삐"
						value={manualNumber}
						onChange={(e) => setManualNumber(e.target.value)}
					/>
					<Button
						onClick={() => {
							console.log(manualNumber)
							onScanSuccess(manualNumber)
						}}>
						제출
					</Button>
				</div>
			)}
			<h6>같은 번호는 바구니에서 수량을 조절해주세요.</h6>
			<hr style={{height: "2px"}} />
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
				}}>
				※이력번호 조회에 실패했습니다
			</h6>
			<div
				style={{
					display: wrongCut ? "flex" : "none",
					justifyContent: "space-between",
				}}>
				<h6 style={{color: "red"}}>
					※선택한 부위가 <br />
					이력번호의 육종과 맞지 않습니다!
					<br />
					다시 확인해주세요!!
				</h6>

				<Button style={{width: "auto"}} onClick={goToPreset}>
					돌아가기
				</Button>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					marginTop: "10px",
				}}>
				<Button
					style={{width: "8rem", height: "3rem"}}
					disabled={
						!forceEnabled
						// || (forceEnabled && (!isButtonEnabled || wrongCut))
					}
					onClick={onAddButtonClick}>
					{showLoading ? <Spinner animation="border" size="sm" /> : <>추가</>}
				</Button>
			</div>
			<hr style={{height: "2px"}} /> <h4>바구니:</h4>
			<ScanResultCart
				items={items.sort(
					(a, b) => Number(a.meatNumber) - Number(b.meatNumber),
				)}
				modifyItems={setItems}
			/>
			<div
				style={{
					display: "flex",
					width: "100%",
					justifyContent: "center",
					marginTop: "20px",
				}}>
				<Button
					style={{width: "8rem", height: "3rem"}}
					disabled={items.length === 0}
					onClick={onNextButtonClicked}>
					다음
				</Button>
			</div>
		</div>
	)
}
