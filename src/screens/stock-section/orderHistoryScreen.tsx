import {useNavigate} from "react-router-dom"
import {OrderHistoryTable} from "../../components/stock-section/table"
import {StockOrder} from "../../utils/types/stockTypes"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {
	QueryEndAtConstraint,
	QueryStartAtConstraint,
	endAt,
	endBefore,
	limit,
	limitToLast,
	orderBy,
	startAfter,
} from "firebase/firestore"
import {useEffect, useMemo, useState} from "react"

export const OrderHistoryScreen = () => {
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)
	const [cursor, setCursor] = useState<
		QueryStartAtConstraint | QueryEndAtConstraint
	>()
	const limitation = useMemo(() => {
		if (cursor instanceof QueryEndAtConstraint) return limitToLast(pageSize)
		return limit(pageSize)
	}, [pageSize, cursor])

	const {data, loading, refetch, firstDoc, lastDoc} = useFBFetch<StockOrder>(
		fbCollections.sp2Order,
		undefined,
		orderBy("dateTime", "desc"),
		limitation,
		cursor,
	)
	const onBackClick = () => {
		navigate("../")
	}
	useEffect(() => {
		refetch().then(() => {
			if (cursor instanceof QueryStartAtConstraint) {
				setCurrentPage(currentPage + 1)
			} else if (cursor instanceof QueryEndAtConstraint) {
				setCurrentPage(currentPage - 1)
			}
		})
	}, [limitation])

	return (
		<div
			style={{
				width: "100vw",
				paddingTop: "12px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignContent: "center",
			}}>
			<button style={{marginBottom: "20px"}} onClick={onBackClick}>
				뒤로
			</button>
			<div>
				<button
					disabled={loading || currentPage === 1}
					onClick={() => {
						if (currentPage > 1) {
							setCursor(endBefore(firstDoc))
						}
					}}>
					{"<"}
				</button>
				<button
					disabled={loading}
					onClick={() => {
						setCursor(startAfter(lastDoc))
					}}>
					{">"}
				</button>
			</div>
			<OrderHistoryTable data={data} />
		</div>
	)
}
