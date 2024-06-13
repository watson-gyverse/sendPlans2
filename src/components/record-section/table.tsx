import {
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import {MeatInfoAiO, MeatTableData} from "../../utils/types/meatTypes"
import {useEffect, useState} from "react"
import columns from "./columns"
import {ThreeStepComma, parseToDate} from "../../utils/consts/functions"
import styled from "styled-components"
import {TableHeader} from "./tableHeader"

interface IRecordTable {
	data: MeatInfoAiO[]
}

export const RecordTable = (props: IRecordTable) => {
	const {data} = props
	const [tableData, setTableData] = useState<MeatTableData[]>([])
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
						parseToDate(b.storedDate).getTime() -
						parseToDate(a.storedDate).getTime()
					)
				} else {
					if (a.agingDate !== b.agingDate) {
						return (
							parseToDate(b.agingDate).getTime() -
							parseToDate(a.agingDate).getTime()
						)
					} else {
						if (a.cutDate !== b.cutDate) {
							return (
								parseToDate(b.cutDate).getTime() -
								parseToDate(a.cutDate).getTime()
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
		state: {
			sorting,
			columnFilters,
		},
		enableMultiSort: true,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	})
	return (
		<table>
			<thead>
				{t.getHeaderGroups().map((hGroup) => {
					return (
						<tr key={hGroup.id}>
							{hGroup.headers.map((header) => {
								return <TableHeader header={header} table={t} />
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

const TableCell = styled.td`
	border: 1px solid black;
	padding: 6px 10px;
`
