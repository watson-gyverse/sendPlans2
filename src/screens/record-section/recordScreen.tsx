import {useEffect, useState} from "react"
import {RecordPCScreen} from "./recordPCScreen"
import RecordMobileScreen from "./recordMobileScreen"
import {useMediaQuery} from "react-responsive"
import styled from "styled-components"
import {Button, Collapse} from "react-bootstrap"
import {Filter} from "../../components/record-section/filter"
import useFBFetch from "../../hooks/useFetch"
import {FirestorePlace} from "../../utils/types/otherTypes"
import {fbCollections} from "../../utils/consts/constants"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import {useNavigate} from "react-router-dom"

export default function RecordBranchScreen() {
	const navigate = useNavigate()
	const data = useFBFetch<MeatInfoAiO>(fbCollections.sp2Record).data
	const [filterOpen, setFilterOpen] = useState(true)
	const [filteredRecords, setFilteredRecords] = useState<MeatInfoAiO[]>([])
	const places = useFBFetch<FirestorePlace>(fbCollections.sp2Places).data
	const isMobile = useMediaQuery({query: "(max-width: 1224px)"})
	const onClickBack = () => {
		navigate("../")
	}
	useEffect(() => {
		console.log(filteredRecords)
	}, [filteredRecords])
	return (
		<div>
			<button onClick={onClickBack}>뒤로</button>
			<h1>히스토리</h1>
			<Button
				variant="warning"
				style={{marginLeft: "20px"}}
				onClick={() => setFilterOpen(!filterOpen)}
				aria-controls="filterCollapse"
				// aria-expanded={filterOpen}
			>
				필터
			</Button>
			<Collapse in={filterOpen}>
				<div
					id="filterCollapse"
					style={{
						backgroundColor: "#eeeeb5",
						padding: "6px 4px",
						marginTop: "10px",
					}}>
					<Filter
						data={data}
						setFilteredRecords={setFilteredRecords}
						places={places}
						direction={isMobile ? "column" : "row"}
					/>
				</div>
			</Collapse>
			{isMobile ? (
				<RecordMobileScreen data={filteredRecords} />
			) : (
				<RecordPCScreen data={filteredRecords} />
			)}
			{/* <StyledContent>123</StyledContent> */}
		</div>
	)
}

const StyledContent = styled.h1`
	color: black;
	background-color: yellow;
	@media screen and (max-width: 600px) {
		color: red;
		background-color: blue;
	}
`
