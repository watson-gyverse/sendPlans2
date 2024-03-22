import {Button, Collapse} from "react-bootstrap"
import {Filter} from "../../components/record-section/filter"
import {useState} from "react"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import {useNavigate} from "react-router-dom"
import useFBFetch from "../../hooks/useFetch"
import {fbCollections} from "../../utils/consts/constants"
import {RecordCard} from "../../components/record-section/recordCard"
import {FirestorePlace} from "../../utils/types/otherTypes"

export default function RecordScreen() {
	const navigate = useNavigate()
	const [filterOpen, setFilterOpen] = useState(false)
	// const [modalShow, setModalShow] = useState(false)
	const data = useFBFetch<MeatInfoAiO>(fbCollections.sp2Record).data
	const places = useFBFetch<FirestorePlace>(fbCollections.sp2Places).data
	const [filteredRecords, setFilteredRecords] = useState<MeatInfoAiO[]>([])
	const onfilterOpenClick = () => {
		setFilterOpen(!filterOpen)
	}
	const onClickBack = () => {
		navigate("../")
	}

	return (
		<div
			style={{
				backgroundColor: "#f0d286",
				padding: "20px 10px",
				borderRadius: "20px",
			}}>
			<div
				style={{
					top: 0,
					backgroundColor: "#f0d286ba",
					padding: "6px 4px",
				}}>
				<Button variant="warning" onClick={onClickBack}>
					뒤로
				</Button>
				<Button
					variant="warning"
					style={{marginLeft: "20px"}}
					onClick={onfilterOpenClick}
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
						backgroundColor: "#edc86c",
						padding: "6px 4px",
						marginTop: "10px",
					}}>
					<Filter
						data={data}
						setFilteredRecords={setFilteredRecords}
						places={places}
					/>
				</div>
			</Collapse>
			<div style={{height: "2000px"}}>
				{filteredRecords.map((item) => (
					<div>
						<RecordCard
							item={item}
							// setModalShow={setModalShow}
						/>
					</div>
				))}
			</div>
			{/* <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <h6>상세 정보</h6>
                </Modal.Header>
                <Modal.Body></Modal.Body>
            </Modal> */}
		</div>
	)
}
