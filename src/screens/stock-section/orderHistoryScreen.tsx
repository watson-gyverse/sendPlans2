import {useNavigate} from "react-router-dom"
import {OrderHistoryTable} from "../../components/stock-section/table"

export const OrderHistoryScreen = () => {
	const navigate = useNavigate()

	const onBackClick = () => {
		navigate("../")
	}
	return (
		<div style={{paddingTop: "12px"}}>
			<button onClick={onBackClick}>뒤로</button>
			<OrderHistoryTable />
		</div>
	)
}
