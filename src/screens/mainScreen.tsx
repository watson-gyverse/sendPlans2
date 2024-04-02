import {Button, Modal, Stack} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import toast, {Toaster} from "react-hot-toast"
import {GiCardboardBoxClosed} from "react-icons/gi"
import {RiTimer2Line, RiHistoryFill} from "react-icons/ri"
import {VscRocket} from "react-icons/vsc"
import {GiBugNet} from "react-icons/gi"

import {useState} from "react"
export default function MainScreen() {
	const navigate = useNavigate()
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

	const [a, seta] = useState(false)

	return (
		<div>
			<Toaster />
			<Stack gap={3}>
				<h1 style={{fontSize: "3rem", fontFamily: "양진체"}}>미트가이버</h1>
				<p style={{fontSize: "2.2rem"}}>입고/숙성 관리</p>
				<div style={{display: "flex", justifyContent: "space-evenly"}}>
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
				</div>

				<div style={{display: "flex", justifyContent: "space-evenly"}}>
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
						variant="info"
						onClick={naviToConsignScreen}>
						<VscRocket style={{height: "60px", width: "60px"}} />
						<br />
						대량숙성
					</Button>
				</div>
				<div style={{display: "flex", justifyContent: "space-evenly"}}>
					<Button
						style={{height: "140px", width: "140px"}}
						variant="success"
						onClick={naviToReportScreen}>
						<GiBugNet style={{height: "60px", width: "60px"}} />
						<br />
						벌레신고
					</Button>
					<div style={{height: "140px", width: "140px"}}></div>
				</div>
			</Stack>
			<Button style={{display: "none"}} onClick={() => seta(!a)}>
				a
			</Button>
			<Modal show={a} onHide={() => seta(false)} style={{width: "100%"}}>
				<Modal.Header closeButton>
					<h6>상세 정보</h6>
				</Modal.Header>
				<Modal.Body>ㅁㄴㅇㄹ</Modal.Body>
			</Modal>
		</div>
	)
}
