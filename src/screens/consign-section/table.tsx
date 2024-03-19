import {useState} from "react"
import {ConsignData} from "../../utils/types/otherTypes"
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"
import styled from "styled-components"

type TableData = {
	data: ConsignData[]
}

export const ConsignTable = (props: TableData) => {
	const {data} = props
	const columnHelper = createColumnHelper<ConsignData>()

	const columns = [
		columnHelper.accessor("id", {
			header: () => <span>Id</span>,
			cell: (data) => <div>{String(data.getValue()).padStart(3, "0")}</div>,
		}),
		columnHelper.accessor("meatNumber", {
			header: () => <span>이력번호</span>,
			cell: (data) => {
				const value = data.getValue()
				return (
					<div
						style={{
							width: "70px",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}>
						{value}
					</div>
				)
			},
		}),
		columnHelper.accessor("cut", {
			header: () => <span>부위</span>,
			cell: (data) => data.getValue(),
		}),
		columnHelper.accessor("initWeight", {
			header: () => <span>숙성전</span>,
			cell: (data) => data.getValue(),
		}),
		columnHelper.accessor("afterWeight", {
			header: () => <span>숙성후</span>,
			cell: (data) => data.getValue(),
		}),
		columnHelper.accessor("cutWeight", {
			header: () => <span>손질후</span>,
			cell: (data) => {
				const value = data.getValue() ? data.getValue()?.toString() : "-"
				return value
			},
		}),
	]

	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div>
			<table>
				<thead>
					{table.getHeaderGroups().map((hGroup) => (
						<StyledHeaderGroup key={hGroup.id}>
							{hGroup.headers.map((header) => (
								<StyledHeader key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
										  )}
								</StyledHeader>
							))}
						</StyledHeaderGroup>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<StyledCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</StyledCell>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

const StyledHeaderGroup = styled.tr`
	border-bottom: 1px solid #bb3d3d;
`

const StyledHeader = styled.th`
	border-right: 1px solid #afafaf;

	&:last-child {
		border-right: none;
	}
`
const StyledCell = styled.td`
	border-right: 1px solid #afafaf;

	&:last-child {
		border-right: none;
	}
`

const StyledCellItem = styled.p``
