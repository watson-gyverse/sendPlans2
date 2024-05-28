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
				paddingTop: "12px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignContent: "center",
			}}>
			<button style={{marginBottom: "20px"}} onClick={onBackClick}>
				뒤로
			</button>
			<OrderHistoryTable />
		</div>
	)
}
