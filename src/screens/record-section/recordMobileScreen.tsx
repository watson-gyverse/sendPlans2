import {useState} from "react"
import {MeatInfoAiO} from "../../utils/types/meatTypes"
import {useNavigate} from "react-router-dom"
import useFBFetch from "../../hooks/useFBFetch"
import {fbCollections} from "../../utils/consts/constants"
import {RecordCard} from "../../components/record-section/recordCard"
import {FirestorePlace} from "../../utils/types/otherTypes"
import {PortraitDiv} from "../../utils/consts/style"
import {backgroundColors} from "../../utils/consts/colors"

export interface IRecordScreen {
	data: MeatInfoAiO[]
}

export default function RecordMobileScreen(props: IRecordScreen) {
	// const [modalShow, setModalShow] = useState(false)
	// const data = useFBFetch<MeatInfoAiO>(fbCollections.sp2Record).data
	const {data} = props

	return (
		<PortraitDiv
			bgcolor={backgroundColors.record}
			padding="20px 10px"
			// style={{
			// 	backgroundColor: "#f0d286",
			// 	padding: "20px 10px",
			// 	borderRadius: "20px",
			// }}
		>
			<div style={{height: "2000px"}}>
				{data.map((item) => (
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
		</PortraitDiv>
	)
}
