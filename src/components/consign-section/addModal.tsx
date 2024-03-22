import {Modal} from "react-bootstrap"
import styled from "styled-components"
import DatePickerComponent from "../storage-section/datePicker"
import {useEffect, useState} from "react"
import {
	addToFirestore,
	getClientCount,
	updateCount,
} from "../../apis/consignApi"
import {ConsignData} from "../../utils/types/otherTypes"
import moment from "moment"
import useDidMountEffect from "../../hooks/useDidMountEffect"
import toast, {Toaster} from "react-hot-toast"

type AddModalType = {
	client: string
	meatNumber: string
	show: boolean
	setShow: (show: boolean) => void
}

export default function AddModal(props: AddModalType) {
	const {show, setShow, meatNumber, client} = props
	const [date, setDate] = useState(new Date())
	const [cut, setCut] = useState("")
	const [weight, setWeight] = useState("")
	const [recentCount, setRecentCount] = useState(0)
	const [canPostData, setCanPostData] = useState(false)

	const clientData = async () => {
		try {
			await getClientCount(client, setRecentCount)
		} catch (e) {
			console.log(e)
		}
	}
	useDidMountEffect(() => {
		clientData()
	}, [])

	useEffect(() => {
		console.log(recentCount)
	}, [recentCount])

	useEffect(() => {
		setCanPostData(cut.length > 1 && weight.length > 2)
	}, [cut, weight])

	const onSubmitClick = async () => {
		const dateText = moment(date).format("YYYY-MM-DD ")
		console.log(dateText)
		const data: ConsignData = {
			id: recentCount + 1,
			client: client,
			meatNumber: meatNumber,
			cut: cut,
			initWeight: parseInt(weight),
			initDate: dateText,
			afterWeight: null,
			cutWeight: null,
			items: [],
			docId: null,
		}
		await addToFirestore(
			data,
			() => {
				console.log("추가성공")
				toast.success("추가성공")
				updateCount(client, data.id, setRecentCount)
			},
			() => {
				console.log("추가실패")
				toast.error("추가실패")
			},
		)
		await clientData()
	}

	return (
		<Modal
			onShow={async () => clientData()}
			show={show}
			onHide={() => {
				setShow(false)
			}}>
			<Modal.Header closeButton>
				<Modal.Title>입고</Modal.Title>
			</Modal.Header>
			<div
				style={{
					padding: "10px",
					backgroundColor: "#e4f2ec",
				}}>
				<Toaster />
				<RowDiv>
					<BigSpan>위탁사(auto): </BigSpan> <BigSpan>{client}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>이력번호(auto): </BigSpan> <BigSpan>{meatNumber}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>입고일: </BigSpan>
					<div style={{border: "1px solid", borderRadius: "3px"}}>
						<DatePickerComponent
							targetDate={date}
							setTargetDate={setDate}
							variant={"none"}
						/>
					</div>
				</RowDiv>
				<RowDiv>
					<BigSpan>부위: </BigSpan>
					<input
						type="text"
						value={cut}
						onChange={(e) => setCut(e.target.value.slice(0, 5))}
						placeholder="삼겹살, 목살 등"
					/>
				</RowDiv>
				<RowDiv>
					<BigSpan>무게: </BigSpan>
					<input
						type="number"
						value={weight}
						onChange={(e) => setWeight(e.target.value.slice(0, 7))}
						placeholder="g단위 입력"
					/>
				</RowDiv>
				<button onClick={onSubmitClick} disabled={!canPostData}>
					입고 레쓰고
				</button>
			</div>
		</Modal>
	)
}

const BigSpan = styled.span`
	font-size: 1.5rem;
	padding-right: 10px;
`

const RowDiv = styled.div`
	height: 50px;
	display: flex;
	align-items: center;
`
