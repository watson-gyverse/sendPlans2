import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"
import useFBFetch from "../../hooks/useFBFetch"
import {fbCollections} from "../../utils/consts/constants"
import {StockOrder, StockOrderItem} from "../../utils/types/stockTypes"
import styled from "styled-components"
import moment from "moment"
import {useMediaQuery} from "react-responsive"
import {useEffect, useState} from "react"
import {
	QueryEndAtConstraint,
	QueryStartAtConstraint,
	endAt,
	endBefore,
	orderBy,
	startAfter,
	startAt,
} from "firebase/firestore"

type TableData = {
	data: StockOrder[]
}
export const OrderHistoryTable = (props: TableData) => {
	const {data} = props
	const isMobile = useMediaQuery({query: "(max-width: 1440px)"})

	const columnHelper = createColumnHelper<StockOrder>()

	const columns = [
		columnHelper.accessor("dateTime", {
			header: () => <h2>일자</h2>,
			cell: (data) => {
				const d = moment(new Date(data.getValue()))
				const date = d.format("YYYY-MM-DD")
				const time = d.format("HH:mm")
				return (
					<div style={{textAlign: "center"}}>
						<h6>
							{date}
							{isMobile ? <br /> : " "}
							{time}
						</h6>
					</div>
				)
			},
		}),
		columnHelper.accessor("orders", {
			header: () => <h2>내역</h2>,
			cell: (data) => {
				let init: {[index: string]: Array<StockOrderItem>} = {}

				const g = data.getValue().reduce((acc, cur) => {
					let key = cur.catName
					acc[key] ? acc[key].push(cur) : (acc[key] = [cur])
					return acc
				}, init)
				const a = Object.entries(g).map((value) => {
					return (
						<div key={value[0]}>
							<h4>{value[0]}</h4>
							<div>
								{value[1].map((v) => (
									<div
										key={v.catId + v.prdName}
										style={{
											display: "flex",
											flexDirection: "row",
										}}>
										<p style={{marginLeft: "4px"}}>{v.prdName}: </p>
										<p style={{marginLeft: "20px"}}>{v.curStock}</p>
										<p style={{color: v.change < 0 ? "#ff3737" : "#3927ff"}}>
											({v.change < 0 ? "" : "+"}
											{`${v.change}`})
										</p>
									</div>
								))}
							</div>
						</div>
					)
				})
				return a
			},
		}),
		columnHelper.accessor("memo", {
			header: () => <h2>메모</h2>,
			cell: (data) => data.getValue(),
		}),
	]

	const t = useReactTable({
		columns: columns,
		data: data
			// .slice(0, -1)
			.sort((a, b) => parseInt(b.dateTime) - parseInt(a.dateTime)),
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100vw",
				justifyContent: "center",
			}}>
			<table>
				<thead>
					{t.getHeaderGroups().map((hGroup) => {
						return (
							<tr key={hGroup.id}>
								{hGroup.headers.map((header) => {
									return (
										<StyledHeader key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? "-"
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}
										</StyledHeader>
									)
								})}
							</tr>
						)
					})}
				</thead>
				<tbody>
					{t.getRowModel().rows.map((row) => {
						return (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									return (
										<StyledCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</StyledCell>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

const StyledHeader = styled.th`
	border-right: 1px solid #afafaf;
	border-bottom: 1px solid #afafaf;
	/* &:last-child {
		border-right: none;
	} */
`
const StyledCell = styled.td`
	border-right: 1px solid #afafaf;
	border-bottom: 1px solid #afafaf;

	/* &:last-child {
		border-right: none;
	} */
`
