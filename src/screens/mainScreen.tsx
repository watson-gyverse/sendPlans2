import {Button, ButtonGroup, Modal, Stack, ToggleButton} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import toast, {Toaster} from "react-hot-toast"
import {GiCardboardBoxClosed} from "react-icons/gi"
import {RiTimer2Line, RiHistoryFill} from "react-icons/ri"
import {VscRocket} from "react-icons/vsc"
import {GiBugNet} from "react-icons/gi"
import {VscLayoutMenubar} from "react-icons/vsc"
import {useEffect, useState} from "react"
import {PortraitDiv} from "../utils/consts/style"
import {backgroundColors} from "../utils/consts/colors"
import styled from "styled-components"
import {fbLogout, getAuthentication} from "../utils/Firebase"
import {StockModal} from "../components/stock-section/stockModal"
import {LoginUser, addUser, updateUserLogin} from "../apis/userApi"

export default function MainScreen() {
	const navigate = useNavigate()
	const [token, setToken] = useState(sessionStorage.getItem("token"))
	const [tempToken, setTempToken] = useState("")
	const [isLoginModalOpen, setLoginModalOpen] = useState(false)
	const [showingText, setShowingText] = useState("이용약관")
	const [loginUser, setLoginUser] = useState<LoginUser>()

	useEffect(() => {
		const handleTokenChange = (event: StorageEvent) => {
			if (event.storageArea === sessionStorage && event.key === "token") {
				console.log("토큰이 변경됨: ", token)
			}
		}
		window.addEventListener("storage", handleTokenChange)

		return () => {
			window.removeEventListener("storage", handleTokenChange)
		}
	}, [token])
	const naviToDateScreen = () => {
		toast.remove()
		navigate("/storage/")
	}
	const naviToAgingScreen = () => {
		toast.remove()
		navigate("/aging/")
	}
	const naviToHistoryScreen = () => {
		toast.remove()
		// toast("입고/숙성기록\n업데이트 예정")

		navigate("/record")
	}
	const naviToReportScreen = () => {
		toast.remove()
		// toast("입고/숙성기록\n업데이트 예정")

		navigate("/report")
	}
	const naviToConsignScreen = () => {
		toast.remove()
		// toast("입고/숙성기록\n업데이트 예정")

		navigate("/consign")
	}
	const naviToStockScreen = () => {
		toast.remove()
		navigate("/stock")
	}

	const onSignInClick = async () => {
		const result = await getAuthentication()
		if (result !== undefined) {
			setLoginModalOpen(true)
			try {
				const newUser = {
					name: result.user.displayName!,
					email: result.user.email!,
					createdAt: new Date(result.user.metadata.creationTime!).getTime(),
					lastLogin: new Date(result.user.metadata.lastSignInTime!).getTime(),
				}
				if (Math.abs(newUser.createdAt - newUser.lastLogin) > 10000) {
					updateUserLogin(newUser.email)
				}
				setLoginUser(newUser)
			} catch (err) {
				console.error("err", err)
			}

			const token = await result.user.getIdToken()

			setTempToken(token)
		} else {
			setToken("")
		}
	}

	const onSignoutClick = () => {
		const ok = window.confirm("로그아웃 하시겠습니까?")
		if (ok) {
			fbLogout()
			setToken("")
		}
	}

	const onShowingTextChange = (e: any) => {
		setShowingText(e.target.value)
		toast("temp")
	}

	const onRefugeClick = () => {
		setLoginModalOpen(false)
		setTempToken("")
	}

	const onAgreeClick = async () => {
		setLoginModalOpen(false)
		if (loginUser) {
			if (Math.abs(loginUser.createdAt - loginUser.lastLogin) > 10000) {
				updateUserLogin(loginUser.email)
			} else {
				const result = addUser(loginUser)
				console.log("addUser result: ", result)
			}
			setToken(tempToken)
		} else {
			setTempToken("")
		}
		setLoginUser(undefined)
	}

	const onResetSessionClick = () => {
		sessionStorage.removeItem("token")
		setToken("")
		setTempToken("")
	}

	const [a, seta] = useState(false)

	return (
		<PortraitDiv bgColor={backgroundColors.base} padding="20px 10px">
			<Toaster />
			<Stack gap={2} style={{display: "flex", alignItems: "center"}}>
				<p
					style={{
						textAlign: "center",
						margin: "0px",
						padding: "0px",
						fontSize: "3rem",
						fontFamily: "양진체",
						borderBottom:
							token !== "" && token !== null ? "3px solid #00ffb7ff" : "none",
					}}>
					미트가이버
				</p>
				<div style={{display: "flex"}}>
					{!token && (
						<button
							style={{width: "100px"}}
							className="btn-two small orange"
							onClick={onSignInClick}>
							Log in
						</button>
					)}
					{token && (
						<button
							style={{width: "100px"}}
							className="btn-two small red"
							onClick={onSignoutClick}>
							Log out
						</button>
					)}
				</div>
				<StackDiv>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="primary"
						onClick={naviToDateScreen}>
						<GiCardboardBoxClosed style={{height: "60px", width: "60px"}} />
						<br />
						입고하기
					</Button>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="danger"
						onClick={naviToAgingScreen}>
						<RiTimer2Line style={{height: "60px", width: "60px"}} />
						<br />
						숙성하기
					</Button>
				</StackDiv>

				<StackDiv>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="warning"
						onClick={naviToHistoryScreen}>
						<RiHistoryFill style={{height: "60px", width: "60px"}} />
						<br />
						조회하기
					</Button>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="secondary"
						onClick={naviToStockScreen}>
						<VscLayoutMenubar style={{height: "60px", width: "60px"}} />
						<br />
						재고관리
					</Button>
				</StackDiv>
				<StackDiv>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="info"
						onClick={naviToConsignScreen}>
						<VscRocket style={{height: "60px", width: "60px"}} />
						<br />
						대량숙성
					</Button>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="success"
						onClick={naviToReportScreen}>
						<GiBugNet style={{height: "60px", width: "60px"}} />
						<br />
						벌레신고
					</Button>
				</StackDiv>
				<button style={{marginTop: "30px"}} onClick={onResetSessionClick}>
					비상용 세션 초기화
				</button>
			</Stack>
			{isLoginModalOpen && (
				<StockModal>
					<div style={{display: "flex", flexDirection: "column"}}>
						{/* <button onClick={() => setLoginModalOpen(false)}>x</button> */}
						<ButtonGroup style={{justifyContent: "center"}}>
							{["이용약관", "개인정보취급방침"].map((item, idx) => (
								<ToggleButton
									key={idx}
									id={`login-${idx}`}
									value={item}
									type="radio"
									checked={item === showingText}
									onChange={onShowingTextChange}
									style={{
										fontSize: "1rem",
										borderRadius: "0",
									}}>
									{item}
								</ToggleButton>
							))}
						</ButtonGroup>
						<ButtonGroup style={{justifyContent: "center"}}>
							<button className="btn-two small white" onClick={onRefugeClick}>
								동의안함
							</button>
							<button className="btn-two small orange" onClick={onAgreeClick}>
								동의하고 <br />
								로그인하기
							</button>
						</ButtonGroup>
					</div>
				</StockModal>
			)}

			<Button style={{display: "none"}} onClick={() => seta(!a)}>
				a
			</Button>
			<Modal show={a} onHide={() => seta(false)} style={{width: "100%"}}>
				<Modal.Header closeButton>
					<h6>상세 정보</h6>
				</Modal.Header>
				<Modal.Body>ㅁㄴㅇㄹ</Modal.Body>
			</Modal>
		</PortraitDiv>
	)
}

const StackDiv = styled.div`
	display: flex;
	justify-content: space-evenly;
	width: 304px;
`
