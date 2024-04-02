/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Spinner} from "react-bootstrap"
import {Html5QrcodeError} from "html5-qrcode/esm/core"
import Html5QrcodePlugin from "../../components/storage-section/qrScanPlugin"
import {MeatInfoWithCount, MeatScanned} from "../../utils/types/meatTypes"
import {ScanResultBox} from "../../components/storage-section/scanResultBox"
import {getForeignMeatInfo, getMeatInfo} from "../../apis/meatApi"
import toast, {Toaster} from "react-hot-toast"
import {sessionKeys} from "../../utils/consts/constants"
import * as _ from "lodash"
import {ScanResultCart} from "../../components/storage-section/scanResultCart"
import {backgroundColors} from "../../utils/consts/colors"
import useDidMountEffect from "../../hooks/useDidMountEffect"

export default function CameraScreen() {
	const [showScanner, setShowScanner] = useState(true)
	const [manualNumber, setManualNumber] = useState("")

	const [failToGetMeatInfo, setFailedGetMeatInfo] = useState(false)
	const [wrongCut, setWrongCut] = useState(false)

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

	const [loadingState, setLoadingState] = useState(false)

	const [newText, setNewText] = useState("")

	const [isL, setL] = useState(false)
	const onLClick = () => {
		setL(!isL)
	}
	useEffect(() => {
		if (isL && !showScanner) {
			setNewText("L".concat(newText))
		} else if (!isL && !showScanner) {
			setNewText(newText.replace("L", ""))
		}
	}, [isL, showScanner])
	//번호 입력
	const onScanSuccess = (decodedText: string) => {
		console.log("newText: " + decodedText)
		setNewText(decodedText)
	}

	const onScanFailure = (errorMessage: string, error: Html5QrcodeError) => {
		console.warn(`Code scan error = ${error}`)
	}

	// 들어온 텍스트로 api 조회
	useEffect(() => {
		console.log("newText Set")

		if (newText.length >= 12 && newText.length <= 15 && !loadingState) {
			setLoadingState(true)

			if (newText.charAt(0) === "8" || newText.charAt(0) === "9") {
				getForeignMeatInfo(
					newText,
					setGrade,
					setScanSpecies,
					setGender,
					setOrigin,
					setLoadingState,
					setFailedGetMeatInfo,
				)
			} else {
				getMeatInfo(
					newText,
					setGrade,
					setScanSpecies,
					setGender,
					setOrigin,
					setLoadingState,
					setFailedGetMeatInfo,
				)
			}
			setManualNumber("")
		} else {
			console.log("wander")
			console.log(newText)
			console.log(loadingState)
			setLoadingState(false)
		}
	}, [newText])

	//추가버튼을 클릭
	const onAddButtonClick = () => {
		let storedDate = session.getItem(sessionKeys.storageDate)
		let cut = session.getItem(sessionKeys.storageCut)
		let scanned: MeatScanned = {
			storedDate: storedDate!!,
			species: scanSpecies,
			cut: cut!!,
			meatNumber: newText,
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
			if (item.meatNumber === newText) {
				item.count++
				alreadyExist = true
				return false
			}
		})
		if (!alreadyExist) {
			setItems([...items, meatInfo])
			toast.success("바구니에 담겼습니다")
		} else {
			console.log("중복이 있음")
			toast.success("중복된 번호")
			setItems(items)
		}
	}

	const onNextButtonClicked = () => {
		session.setItem(sessionKeys.storageItems, JSON.stringify(items))
		navigate("/storage/edit")
	}

	useEffect(() => {
		setNewText("null")
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
			setLoadingState(false)
		}
	}, [failToGetMeatInfo])

	const goToPreset = () => {
		setFailedGetMeatInfo(false)
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
					<label htmlFor="뽀삐">이력번호</label>
					<button
						onClick={onLClick}
						style={{
							outline: "none",
							backgroundColor: isL ? "#45f4a5" : "#6b8077",
						}}>
						L
					</button>
					<input
						style={{width: "9rem"}}
						type="text"
						name="뽀삐"
						value={manualNumber}
						onChange={(e) => setManualNumber(e.target.value)}
					/>
					<Button
						style={{
							width: "5rem",
						}}
						onClick={() => {
							console.log(manualNumber)
							onScanSuccess(isL ? "L" + manualNumber : manualNumber)
						}}>
						제출
					</Button>
				</div>
			)}
			<h6>같은 번호는 바구니에서 수량을 조절해주세요.</h6>
			<hr style={{height: "2px"}} />
			<h4> {"조회내역: "}</h4>
			<ScanResultBox
				meatNumber={newText ? newText : "null"}
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
					disabled={loadingState || wrongCut || newText === "null"}
					onClick={onAddButtonClick}>
					{loadingState ? <Spinner animation="border" size="sm" /> : <>추가</>}
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
