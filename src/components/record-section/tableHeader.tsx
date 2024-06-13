import {Filters, Header, Table, flexRender} from "@tanstack/react-table"
import styled from "styled-components"
import {MeatTableData} from "../../utils/types/meatTypes"
import {FaSort, FaSortDown, FaSortUp} from "react-icons/fa"
import {useEffect, useMemo} from "react"

type TableHeaderType = {
	header: Header<MeatTableData, unknown>
	table: Table<MeatTableData>
}

export const TableHeader = ({header, table}: TableHeaderType) => {
	const columnFilterValue = header.column.getFilterValue()
	const sortedUniqueValues = useMemo(
		() => Array.from(header.column.getFacetedUniqueValues().keys()).sort(),
		[header.column],
	)
	useEffect(() => {
		console.log(sortedUniqueValues)
	}, [sortedUniqueValues])

	const onFilterChange = (value: any) => {
		if (value === "null") {
			header.column.setFilterValue(null)
		} else {
			header.column.setFilterValue(value)
		}
	}
	return (
		<TableHeaderStyle key={header.id} colSpan={header.colSpan}>
			<div style={{display: "flex"}}>
				<Sorter
					width={header.getSize()}
					isSortable={header.column.getCanSort()}
					onClick={header.column.getToggleSortingHandler()}>
					{header.isPlaceholder
						? null
						: flexRender(header.column.columnDef.header, header.getContext())}
					{
						{
							asc: <FaSortUp />,
							desc: <FaSortDown />,
						}[header.column.getIsSorted() as string]
					}
					{header.column.getCanSort() && !header.column.getIsSorted() ? (
						<FaSort />
					) : null}
				</Sorter>
			</div>
			<ColumnFilter>
				{header.column.getCanFilter() ? (
					<select
						value={columnFilterValue?.toString()}
						onChange={({currentTarget: {value}}) => onFilterChange(value)}>
						<option value="null">선택안함</option>
						{sortedUniqueValues.map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
				) : null}
			</ColumnFilter>
		</TableHeaderStyle>
	)
}

const TableHeaderStyle = styled.th`
	text-align: center;
	background-color: "#f0cb26";
	padding: 6px;
	border: 1px solid black;
	text-weight: bold;
	text-size: 1.1rem;
`
const Sorter = styled.div<ISorter>`
	width: ${(props) => props.width};
	cursor: ${(props) => (props.isSortable ? "pointer" : "default")};
`
const ColumnFilter = styled.div`
	select {
		border: none;
		background-color: transparent;
	}
`
interface ISorter {
	width: number
	isSortable: boolean
}
