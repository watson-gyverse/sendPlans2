import {useEffect, useState} from "react"
import {GetFromBizNum} from "../../apis/bizNoApi"
import {FaCheck} from "react-icons/fa6"
import {Dropdown} from "react-bootstrap"
import styled from "styled-components"
import {IoMdClose} from "react-icons/io"
export const SampleFormScreen = () => {
	const [bizNo, setBizNo] = useState("")
	const [validBizNo, setValidBizNo] = useState("")
	const [company, setCompany] = useState("")
	const [status, setStatus] = useState("")
	const [isValid, setIsValid] = useState(false)
	const [clientName, setClientName] = useState("")
	const [phoneNum, setPhoneNum] = useState("")
	const [address, setAddress] = useState("")
	const [meat, setMeat] = useState("")
	const onBizNoSubmitClick = async () => {
		const item = await GetFromBizNum(1, bizNo.replace("-", ""))
		if (item !== null) {
			setStatus(item.bsttcd)
			if (item.bsttcd === "01") {
				setCompany(item.company)
				setValidBizNo(item.bno)
				setIsValid(true)
			} else {
				setIsValid(false)
				setCompany("")
				setValidBizNo("")
			}
		} else {
			setStatus("04")
			setCompany("")
			setValidBizNo("")
			setIsValid(false)
		}
	}
	useEffect(() => {
		if (bizNo !== validBizNo) {
			setIsValid(false)
			setValidBizNo("")
			setCompany("")
		}
	}, [bizNo])
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				// justifyContent: "center",
				width: "100%",
				height: "100vh",
			}}>
			<RowDiv>
				<p>사업자 등록번호</p>
				<input
					value={bizNo}
					onChange={(e) => setBizNo(e.target.value)}
					placeholder="예) 0123456789"
				/>
				<button onClick={onBizNoSubmitClick}>유효확인</button>
				{isValid && status === "01" && (
					<div style={{display: "flex"}}>
						<FaCheck />
						<p>확인되었습니다</p>
					</div>
				)}
				{!isValid && status !== "" && status !== "01" && <IoMdClose />}
			</RowDiv>
			<RowDiv>
				<p>업체명</p>
				<input value={company} onChange={(e) => setCompany(e.target.value)} />
			</RowDiv>
			<RowDiv>
				<p>담당자명</p>
				<input
					value={clientName}
					onChange={(e) => setClientName(e.target.value)}
				/>
			</RowDiv>
			<RowDiv>
				<p>연락처</p>
				<input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
			</RowDiv>
			<RowDiv>
				<p>샘플 받으실 주소</p>
				<input value={address} onChange={(e) => setAddress(e.target.value)} />
			</RowDiv>
			<RowDiv>
				<p>요청 샘플</p>
				<Dropdown>
					<Dropdown.Toggle>
						<p>{meat}</p>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item>
							<p>ㄱ</p>
						</Dropdown.Item>
						<Dropdown.Item>
							<p>ㄴ</p>
						</Dropdown.Item>
						<Dropdown.Item>
							<p>ㄷ</p>
						</Dropdown.Item>
						<Dropdown.Item>
							<p>ㄹ</p>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</RowDiv>
		</div>
	)
}
const RowDiv = styled.div`
	height: 50px;
	display: flex;
	align-items: center;
`
