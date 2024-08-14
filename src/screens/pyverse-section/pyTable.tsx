import styled from "styled-components"
import {PyverseData} from "../../utils/types/otherTypes"
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table"

interface IPyverseTable {
	tableData: PyverseData[]
}

export const PyverseTable = (props: IPyverseTable) => {
	const {tableData} = props

	const t = useReactTable({
		data: tableData,
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		defaultColumn: {
			size: 80,
			minSize: 80,
			maxSize: 200,
		},
	})

	return (
		<table style={{tableLayout: "fixed", width: "100%"}}>
			<thead>
				{t.getHeaderGroups().map((hGroup) => {
					return (
						<tr key={hGroup.id}>
							{hGroup.headers.map((header) => {
								return (
									<Pth
										key={header.id}
										colSpan={header.colSpan}
										style={{width: `${header.column.getSize()}px`}}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</Pth>
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
							<Ptd key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</Ptd>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

const Pth = styled.th`
	height: 3rem;
	text-align: center;
	border-bottom: 2px solid black;
`

const Ptd = styled.td`
	border-bottom: 1px solid #e2e2e2;
	border-right: 1px solid #e2e2e2;
	text-align: center;
`

const columnHelper = createColumnHelper<PyverseData>()
const columns = [
	columnHelper.accessor("store", {
		id: "store",
		cell: (info) => info.getValue(),
		header: () => "쇼핑몰",
		size: 150,
	}),
	columnHelper.accessor("species", {
		cell: (info) => info.getValue(),
		header: () => "카테고리",
	}),
	columnHelper.accessor("cut", {
		id: "cut",
		header: () => "부위",
	}),
	columnHelper.accessor("grade", {
		header: () => "등급",
		minSize: 80,
	}),
	columnHelper.accessor("name", {
		header: () => "상품명",
		size: 240,
	}),
	columnHelper.accessor("freeze", {
		header: () => "냉장",
		size: 40,
	}),
	columnHelper.accessor("price", {
		header: () => "가격(/kg)",
	}),
	columnHelper.accessor("weight", {
		header: () => "무게",
	}),
	columnHelper.accessor("total_price", {
		header: () => "총 가격",
	}),
	columnHelper.accessor("date", {
		header: () => "가공일자",
	}),
	columnHelper.accessor("exp_date", {
		header: () => "소비기한",
	}),
	columnHelper.accessor("stock", {
		header: () => "재고",
	}),
	columnHelper.accessor("origin", {
		header: () => "원산지",
	}),
	columnHelper.accessor("brand", {
		header: () => "브랜드",
	}),
	columnHelper.accessor("fat_back", {
		header: () => "등지방",
	}),
	columnHelper.accessor("fat_section", {
		header: () => "등심면적",
	}),
	columnHelper.accessor("inner_fat", {
		header: () => "근내지방",
	}),
	columnHelper.accessor("url", {
		header: () => "URL",
		cell: (info) => (
			<a
				href={info.getValue()}
				target="_blank"
				rel="noreferrer"
				style={{
					color: "#0057bb",
				}}>
				바로가기
			</a>
		),
	}),
]
