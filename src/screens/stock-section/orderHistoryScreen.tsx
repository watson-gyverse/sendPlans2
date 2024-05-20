import {useNavigate} from "react-router-dom"
import {OrderHistoryTable} from "../../components/stock-section/table"

export const OrderHistoryScreen = () => {
	const navigate = useNavigate()

	const onBackClick = () => {
		navigate("../")
	}
	return (
		<div
			style={{
				width: "auto",
				paddingTop: "12px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}>
			<button style={{width: "600px"}} onClick={onBackClick}>
				뒤로
			</button>
			<OrderHistoryTable />
		</div>
	)
}
