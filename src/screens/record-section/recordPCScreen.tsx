import styled from "styled-components"
import {RecordTable} from "../../components/record-section/table"
import {IRecordScreen} from "./recordMobileScreen"

export const RecordPCScreen = (props: IRecordScreen) => {
	const {data} = props

	return (
		<LandScapeDiv>
			<span style={{marginLeft: "5px"}}>※필터 다중 적용은 Shift+클릭</span>
			<RecordTable data={data} />
		</LandScapeDiv>
	)
}

const LandScapeDiv = styled.div`
	display: flex;
	flex-direction: column;

	justify-content: center;
`
