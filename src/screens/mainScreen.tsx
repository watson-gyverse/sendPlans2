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
	const [token, setToken] = useState(localStorage.getItem("token"))
	const [tempToken, setTempToken] = useState("")
	const [isLoginModalOpen, setLoginModalOpen] = useState(false)
	const [showingText, setShowingText] = useState("이용약관")
	const [isAgreeChecked, setAgreeChecked] = useState(false)

	const handleAgreeBoxChange = () => {
		setAgreeChecked(!isAgreeChecked)
	}
	const [description, setDesc] = useState("")

	const [loginUser, setLoginUser] = useState<LoginUser>()

	useEffect(() => {
		const handleTokenChange = (event: StorageEvent) => {
			if (event.storageArea === localStorage && event.key === "token") {
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
			try {
				const newUser = {
					name: result.user.displayName!,
					email: result.user.email!,
					createdAt: new Date(result.user.metadata.creationTime!).getTime(),
					lastLogin: new Date(result.user.metadata.lastSignInTime!).getTime(),
				}
				const token = await result.user.getIdToken()
				if (Math.abs(newUser.createdAt - newUser.lastLogin) > 10000) {
					updateUserLogin(newUser.email)
					localStorage.setItem("token", result.user.refreshToken)
					setToken(token)
				} else {
					setLoginModalOpen(true)
					setTempToken(token)
				}
				setLoginUser(newUser)
			} catch (err) {
				console.error("err", err)
				toast.error("알수없는 오류 발생")
			}
		} else {
			setToken("")
			localStorage.removeItem("token")
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
			localStorage.setItem("token", tempToken)
		} else {
			setTempToken("")
		}
		setLoginUser(undefined)
	}

	const onResetSessionClick = () => {
		localStorage.removeItem("token")
		setToken("")
		setTempToken("")
	}

	const [a, seta] = useState(false)

	return (
		<PortraitDiv bgColor={backgroundColors.base} padding="20px 10px 0px 10px">
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
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
						height: "60px",
						padding: "6px",
						backgroundColor: "#bababa",
						borderTop: "2px solid #454545",
					}}>
					<a
						style={{color: "#000000"}}
						target="_blank"
						href="https://gyverse.com/policy-privacy"
						rel="noreferrer noopener">
						개인정보 취급방침
					</a>
				</div>
			</Stack>
			{isLoginModalOpen && (
				<StockModal closableAtOutside={false} setOpen={setLoginModalOpen}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							// justifyContent: "center",
							alignItems: "center",
						}}>
						<label>
							<input
								type="checkbox"
								checked={isAgreeChecked}
								onChange={handleAgreeBoxChange}
							/>
							(필수) 개인정보 수집·이용 동의
						</label>
						<p style={{fontSize: "0.7rem"}}>
							자세한 내용은{" "}
							<a
								target="_blank"
								href="https://gyverse.com/policy-privacy"
								rel="noreferrer noopener">
								개인정보 처리방침
							</a>
							을 확인해주세요 귀하는 위와 같이 개인정보를 수집 이용하는데 동의를
							거부할 권리가 있습니다. 필수 수집 항목에 대한 동의를 거절하는 경우
							서비스 이용이 제한될 수 있습니다.
						</p>
						<ButtonGroup style={{justifyContent: "center"}}>
							<button className="btn-two small white" onClick={onRefugeClick}>
								동의안함
							</button>
							<button
								disabled={!isAgreeChecked}
								className="btn-two small orange"
								onClick={onAgreeClick}>
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
