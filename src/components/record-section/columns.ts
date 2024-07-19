import {createColumnHelper} from "@tanstack/react-table"
import {MeatTableData} from "../../utils/types/meatTypes"

const columnHelper = createColumnHelper<MeatTableData>()
const columns = [
	columnHelper.group({
		header: "일자",
		columns: [
			columnHelper.accessor("storedDate", {
				id: "storedDate",
				cell: (info) => info.getValue(),
				header: () => "입고",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("agingDate", {
				id: "agingDate",
				cell: (info) => info.getValue(),
				header: () => "숙성 시작",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("finishDate", {
				id: "finishDate",
				cell: (info) => info.getValue(),
				header: () => "숙성 종료",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("cutDate", {
				id: "cutDate",
				cell: (info) => info.getValue(),
				header: () => "손질",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("ultraTime", {
				id: "ultraTime",
				cell: (info) => info.getValue(),
				header: () => "초음파(h)",
			}),
		],
	}),
	columnHelper.group({
		header: "고기",
		columns: [
			columnHelper.accessor("species", {
				header: () => "육종",
				filterFn: "equalsString",
				size: 70,
			}),
			columnHelper.accessor("cut", {
				id: "cut",
				cell: (info) => info.getValue(),
				header: () => "부위",
				filterFn: "equalsString",
				enableSorting: false,
				meta: {
					filterVariant: "select",
				},
			}),
			columnHelper.accessor("grade", {
				id: "grade",
				cell: (info) => info.getValue(),
				header: () => "등급",
				filterFn: "equalsString",
			}),
			columnHelper.accessor("price", {
				id: "price",
				cell: (info) => info.getValue(),
				header: () => "가격(100g)",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("gender", {
				id: "gender",
				cell: (info) => info.getValue(),
				header: () => "암수",
				enableSorting: false,
				filterFn: "equalsString",
			}),
		],
	}),
	columnHelper.group({
		header: "무게",
		columns: [
			columnHelper.accessor("beforeWeight", {
				id: "beforeWeight",
				cell: (info) => info.getValue() + "g",
				header: () => "입고",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("afterWeight", {
				id: "afterWeight",
				cell: (info) => info.getValue() + "g",
				header: () => "숙성후",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("cutWeight", {
				id: "cutWeight",
				cell: (info) => info.getValue() + "g",
				header: () => "손질후",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("loss", {
				id: "loss",
				cell: (info) => info.getValue(),
				header: () => "숙성로스",
				enableColumnFilter: false,
			}),

			columnHelper.accessor("lossP", {
				id: "lossP",
				cell: (info) => info.getValue(),
				header: () => "숙성로스%",
				enableColumnFilter: false,
			}),

			columnHelper.accessor("cutLoss", {
				id: "cutLoss",
				cell: (info) => info.getValue(),
				header: () => "최종로스",
				enableColumnFilter: false,
			}),
			columnHelper.accessor("cutLossP", {
				id: "cutLossP",
				cell: (info) => info.getValue(),
				header: () => "최종로스%",
				enableColumnFilter: false,
			}),
		],
	}),
]

export default columns
