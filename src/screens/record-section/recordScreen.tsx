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
import {backgroundColors} from "../../utils/consts/colors"

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
		<div
			style={{
				backgroundColor: backgroundColors.record,
				width: "100%",
				height: "100%",
			}}>
			<div
				style={{
					paddingTop: "10px",
					paddingLeft: isMobile ? "0" : "20px",
					display: "flex",
					alignItems: "center",
					justifyContent: isMobile ? "center" : "flex-start",
				}}>
				<Button variant="warning" onClick={onClickBack}>
					뒤로
				</Button>
				<h1>히스토리</h1>
				<Button
					variant="warning"
					onClick={() => setFilterOpen(!filterOpen)}
					aria-controls="filterCollapse"
					// aria-expanded={filterOpen}
				>
					필터
				</Button>
			</div>

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
