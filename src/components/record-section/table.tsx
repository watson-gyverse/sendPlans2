import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table"
import useFBFetch from "../../hooks/useFetch"
import {MeatInfoAiO, MeatTableData} from "../../utils/types/meatTypes"
import {fbCollections} from "../../utils/consts/constants"
import {useEffect, useState} from "react"
import columns from "./columns"
import {
	ThreeStepComma,
	parseToDate,
	sortMeatInfoArray,
} from "../../utils/consts/functions"
import styled from "styled-components"

interface IRecordTable {
	data: MeatInfoAiO[]
}

export const RecordTable = (props: IRecordTable) => {
	const {data} = props
	const [tableData, setTableData] = useState<MeatTableData[]>([])

	useEffect(() => {
		const added = data
			.map((datum) => ({
				...datum,
				storedDate: datum.storedDate.split(" ")[0],
				agingDate: datum.agingDate ? datum.agingDate.split(" ")[0] : "",
				finishDate: datum.finishDate ? datum.finishDate.split(" ")[0] : "",
				cutDate: datum.cutDate ? datum.cutDate.split(" ")[0] : "",
				loss:
					datum.afterWeight && datum.beforeWeight
						? ThreeStepComma(
								(datum.afterWeight - datum.beforeWeight).toString(),
						  ) + "g"
						: null,
				lossP:
					datum.afterWeight && datum.beforeWeight
						? ThreeStepComma(
								(
									((datum.afterWeight - datum.beforeWeight) /
										datum.beforeWeight) *
									100
								)
									.toFixed(2)
									.toString(),
						  ) + "%"
						: null,
				cutLoss:
					datum.cutWeight && datum.beforeWeight
						? ThreeStepComma(
								(datum.cutWeight - datum.beforeWeight).toString(),
						  ) + "g"
						: null,
				cutLossP:
					datum.cutWeight && datum.beforeWeight
						? ThreeStepComma(
								(
									((datum.cutWeight - datum.beforeWeight) /
										datum.beforeWeight) *
									100
								)
									.toFixed(2)
									.toString(),
						  ) + "%"
						: null,
			}))
			.sort((a, b) => {
				if (a.storedDate !== b.storedDate) {
					return (
						parseToDate(a.storedDate).getTime() -
						parseToDate(b.storedDate).getTime()
					)
				} else {
					if (a.agingDate !== b.agingDate) {
						return (
							parseToDate(a.agingDate).getTime() -
							parseToDate(b.agingDate).getTime()
						)
					} else {
						if (a.cutDate !== b.cutDate) {
							return (
								parseToDate(a.cutDate).getTime() -
								parseToDate(b.cutDate).getTime()
							)
						}
						return Number(a.entry) - Number(b.entry)
					}
				}
			})
		setTableData(added)
	}, [data])

	const t = useReactTable({
		columns: columns,
		data: tableData,
		getCoreRowModel: getCoreRowModel(),
	})
	return (
		<table>
			<thead>
				{t.getHeaderGroups().map((hGroup) => {
					return (
						<tr key={hGroup.id}>
							{hGroup.headers.map((header) => {
								return (
									<TableHeader key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? "-"
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</TableHeader>
								)
							})}
						</tr>
					)
				})}
			</thead>
			<tbody>
				{t.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

const TableHeader = styled.th`
	text-align: center;
	background-color: "#f0cb26";
	padding: 6px;
	border: 1px solid black;
	text-weight: bold;
	text-size: 1.1rem;
`

const TableCell = styled.td`
	border: 1px solid black;
	padding: 6px 10px;
`
