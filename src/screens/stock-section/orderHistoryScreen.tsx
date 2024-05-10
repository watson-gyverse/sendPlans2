import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {StockOrder} from "../../utils/types/stockTypes"

export const OrderHistoryScreen = () => {
	const {data, refetch} = useFBFetch<StockOrder>(fbCollections.sp2Order)
	return <div></div>
}
