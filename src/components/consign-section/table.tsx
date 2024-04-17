/* eslint-disable react-hooks/exhaustive-deps */
import {ConsignData} from "../../utils/types/otherTypes"
import {
	Row,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"
import {useEffect, useState} from "react"
import styled from "styled-components"
import EditModal from "./editModal"

type TableData = {
	data: ConsignData[]
	refetch: () => Promise<void>
}

export const ConsignTable = (props: TableData) => {
	const {data, refetch} = props
	const [isEllipsis, setEllipsis] = useState(true)
	const [editModalShow, setEditModalShow] = useState(false)
	const [currentRowData, setCurrentRowData] = useState<
		ConsignData | undefined
	>()
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
							overflowWrap: isEllipsis ? "normal" : "break-word",
						}}
						onClick={() => setEllipsis(!isEllipsis)}>
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
			cell: (data) => {
				const value = data.getValue() ? data.getValue()?.toString() : "-"
				return value
			},
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

	const onRowClick = (row: Row<ConsignData>) => {
		console.log(row.original)
		setCurrentRowData(row.original)
	}

	useEffect(() => {
		console.log(editModalShow)
		refetch()
	}, [editModalShow])
	useEffect(() => {
		setEditModalShow(true)
	}, [currentRowData])

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
						<tr key={row.id} onClick={() => onRowClick(row)}>
							{row.getVisibleCells().map((cell) => (
								<StyledCell
									key={cell.id}
									// onClick={() => setEditModalShow(true)}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</StyledCell>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{currentRowData ? (
				<EditModal
					show={editModalShow}
					setShow={setEditModalShow}
					data={currentRowData}
				/>
			) : (
				<></>
			)}
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
