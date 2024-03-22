/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from "react"
import {ConsignItem} from "../../utils/types/otherTypes"

export type PortionData = {
	items: ConsignItem[]
	setItems: (items: ConsignItem[]) => void
}

export const PortionTable = (props: PortionData) => {
	//items: 기존
	//setItems: 새 아이템
	const {items, setItems} = props
	const [newItemsWeight, setItemsWeight] = useState<string[]>([])
	const [itemInputCount, setInputCount] = useState(1)

	useEffect(() => {
		console.log("뭔데그래서", items)
	}, [])

	useEffect(() => {
		console.log("newItemsWeights", newItemsWeight)

		const lastId = items.length > 0 ? items[items.length - 1].id : 1
		const newItems: ConsignItem[] = newItemsWeight.map((weight, index) => {
			return {id: lastId + index, weight: parseInt(weight)}
		})

		setItems([...Array.from(items), ...Array.from(newItems)])
	}, [newItemsWeight])

	useEffect(() => {
		console.log("item count: ", itemInputCount)
		const newArray = new Array(itemInputCount)
			.fill("")
			.map((_, i) => newItemsWeight[i] || "")
		setItemsWeight(newArray)
	}, [itemInputCount])

	const onAddButtonClick = () => {
		setInputCount(itemInputCount + 1)
	}
	const onXInputClick = (index: number) => {
		console.log("x클릭: ", index)

		if (itemInputCount > 1) {
			const a = newItemsWeight.filter((item, idx) => idx !== index)
			setItemsWeight(a)
			setInputCount(itemInputCount - 1)
		}
	}

	const onItemInputChange = (value: string, index: number) => {
		const a: string[] = JSON.parse(JSON.stringify(newItemsWeight))
		a[index] = value
		console.log("a: ", a)

		setItemsWeight(a)
	}

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>소분한 무게</th>
					</tr>
				</thead>
				<tbody>
					{Array.from(items).map((row) => (
						<tr>
							<td>{row.weight}</td>
							<td>
								<button>x</button>
							</td>
						</tr>
					))}
					<tr>
						<div style={{display: "flex", flexDirection: "column"}}>
							{Array.from({length: itemInputCount}, (_, index) => (
								<td key={index} style={{display: "flex", flexDirection: "row"}}>
									<input
										value={newItemsWeight[index]}
										type="number"
										onChange={(e) => onItemInputChange(e.target.value, index)}
									/>
									<button onClick={() => onXInputClick(index)}>x</button>
								</td>
							))}
						</div>
					</tr>
					<button onClick={onAddButtonClick}>+</button>
				</tbody>
			</table>
		</div>
	)
}
