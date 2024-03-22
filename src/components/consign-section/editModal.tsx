/* eslint-disable react-hooks/exhaustive-deps */
import {Modal} from "react-bootstrap"
import styled from "styled-components"
import toast, {Toaster} from "react-hot-toast"
import {ConsignData, ConsignItem} from "../../utils/types/otherTypes"
import {useEffect, useState} from "react"
import {updateExistingItem} from "../../apis/consignApi"

type EditModalType = {
	data: ConsignData
	show: boolean
	setShow: (show: boolean) => void
}

export default function EditModal(props: EditModalType) {
	const {show, setShow, data} = props
	const [newAfterWeight, setAfterWeight] = useState(
		isNullOrNanOrUndefined(data.afterWeight) ? "" : String(data.afterWeight)!!,
	)
	const [newCutWeight, setCutWeight] = useState(
		isNullOrNanOrUndefined(data.cutWeight) ? "" : String(data.cutWeight)!!,
	)
	const [newItems, setItems] = useState<ConsignItem[]>([])
	// const [canRequest, setCanRequest] = useState(false)

	const [newItemsWeight, setItemsWeight] = useState<string[]>([])
	const [itemInputCount, setInputCount] = useState(1)

	const onSubmitClick = () => {
		const {afterWeight, cutWeight, items, ...unchangedData} = data
		const updateData: ConsignData = {
			...unchangedData,
			afterWeight: parseInt(newAfterWeight),
			cutWeight: parseInt(newCutWeight),
			items: [...Array.from(data.items), ...newItems],
		}
		updateExistingItem(data.docId!!, updateData, () => {
			setShow(false)
			toast.success("업데이트 완료")
		})
	}

	const onItemInputChange = (value: string, index: number) => {
		const a: string[] = JSON.parse(JSON.stringify(newItemsWeight))
		a[index] = value
		console.log("a: ", a)

		setItemsWeight(a)
	}

	const onExistXClick = (id: number) => {
		const ok = window.confirm("정말 삭제하시겠습니까?")
		if (ok) {
			const {items, ...unchangedData} = data
			const filtered: ConsignData = {
				...unchangedData,
				items: data.items.filter((val, index) => val.id !== id),
			}
			updateExistingItem(data.docId!!, filtered, () => {
				setShow(false)
				toast.success("삭제완료")
			})
		}
	}
	const onXInputClick = (index: number) => {
		console.log("x클릭: ", index)

		if (itemInputCount > 1) {
			const a = newItemsWeight.filter((item, idx) => idx !== index)
			setItemsWeight(a)
			setInputCount(itemInputCount - 1)
		}
	}
	useEffect(() => {
		console.log("newItemsWeights", newItemsWeight)

		const lastId = newItems.length > 0 ? newItems[newItems.length - 1].id : 1
		const newOne: ConsignItem[] = newItemsWeight.map((weight, index) => {
			return {id: lastId + index, weight: parseInt(weight)}
		})

		setItems(newOne)
	}, [newItemsWeight])
	const onAddButtonClick = () => {
		setInputCount(itemInputCount + 1)
	}
	useEffect(() => {
		console.log("each: ", newAfterWeight, " ", newCutWeight, " ")
		// setNewData({
		// 	...data,
		// 	afterWeight: parseInt(afterWeight),
		// 	cutWeight: parseInt(cutWeight),
		// 	items: newItems,
		// })
	}, [newAfterWeight, newCutWeight, newItems])

	return (
		<Modal
			onShow={() => {}}
			show={show}
			onHide={() => {
				setShow(false)
				setItemsWeight([])
				setInputCount(1)
				setItems([])
			}}>
			<Toaster />
			<Modal.Header closeButton>
				<Modal.Title>
					업데이트 {data.docId} {data.cut}
				</Modal.Title>
			</Modal.Header>
			<div
				style={{
					padding: "10px",
					backgroundColor: "#e4f2ec",
				}}>
				<Toaster />
				<RowDiv>
					<BigSpan>이력번호: </BigSpan>
					<BigSpan>{data.meatNumber}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>입고일: </BigSpan>
					<BigSpan>{data.initDate}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>부위: </BigSpan>
					<BigSpan>{data.cut}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>숙성 전 무게: </BigSpan>
					<BigSpan>{data.initWeight}</BigSpan>
				</RowDiv>
				<RowDiv>
					<BigSpan>숙성 후 무게: </BigSpan>
					{isNullOrNanOrUndefined(data.afterWeight) ? (
						<input
							type="number"
							onChange={(e) => setAfterWeight(e.target.value.slice(0, 7))}
						/>
					) : (
						<BigSpan>{data.afterWeight}</BigSpan>
					)}
				</RowDiv>
				<RowDiv>
					<BigSpan>손질 후 무게: </BigSpan>
					{isNullOrNanOrUndefined(data.cutWeight) ? (
						<input
							type="number"
							onChange={(e) => setCutWeight(e.target.value.slice(0, 7))}
						/>
					) : (
						<BigSpan>{data.cutWeight}</BigSpan>
					)}
				</RowDiv>
				{/* <PortionTable items={data.items} setItems={setItems} /> */}
				<table>
					<thead>
						<tr>
							<th>소분한 무게</th>
						</tr>
					</thead>
					<tbody>
						{data.items.map((row) => (
							<tr key={row.id}>
								<td>{row.weight}</td>
								<td>
									<button onClick={() => onExistXClick(row.id)}>x</button>
								</td>
							</tr>
						))}
						<tr>
							<div style={{display: "flex", flexDirection: "column"}}>
								{Array.from({length: itemInputCount}, (_, index) => (
									<td style={{display: "flex", flexDirection: "row"}}>
										<input
											value={newItemsWeight[index]}
											type="number"
											onChange={(e) => onItemInputChange(e.target.value, index)}
										/>
										<td>
											<button onClick={() => onXInputClick(index)}>x</button>
										</td>
									</td>
								))}
							</div>
						</tr>
						<button onClick={onAddButtonClick}>+</button>
					</tbody>
				</table>
				<button onClick={onSubmitClick}>수정 레쓰고</button>
			</div>
		</Modal>
	)
}

const BigSpan = styled.span`
	font-size: 1rem;
	padding-right: 10px;
`

const RowDiv = styled.div`
	height: 30px;
	display: flex;
	align-items: center;
`

function isNullOrNanOrUndefined(a: any): boolean {
	if (a === null || a === undefined || Number.isNaN(a)) {
		return true
	}
	return false
}
