import {useEffect, useState} from "react"
import {PyverseTable} from "./pyTable"
import {PyverseData} from "../../utils/types/otherTypes"
import _ from "lodash"
import {GetRecentPyverse} from "../../apis/pyverseApi"
import {useNavigate} from "react-router-dom"

export const PyverseScreen = () => {
	const navigate = useNavigate()
	const [tableData, setTableData] = useState<PyverseData[]>([])

	useEffect(() => {
		console.log(tableData)
	}, [tableData])

	const naviToHome = () => {
		navigate("../")
	}
	const onPyClick = _.debounce(async () => {
		const pydata = await GetRecentPyverse()
		if (pydata) {
			console.log(pydata)
			setTableData(pydata)
		}
	}, 1000)

	return (
		<div>
			<button onClick={naviToHome}>뒤로</button>
			<button onClick={onPyClick}>조회</button>
			{tableData.length > 1 && <PyverseTable tableData={tableData} />}
		</div>
	)
}
