import {useNavigate} from "react-router-dom"

export default function ErrorScreen() {
	const navigate = useNavigate()
	return (
		<div>
			<h5>존재하지않는 페이지입니다.</h5>
			<button onClick={() => navigate("/")}>메인으로</button>
		</div>
	)
}
