import styled from "styled-components"
import {RecordTable} from "../../components/record-section/table"
import {IRecordScreen} from "./recordMobileScreen"

export const RecordPCScreen = (props: IRecordScreen) => {
	const {data} = props

	return (
		<LandScapeDiv>
			<RecordTable data={data} />
		</LandScapeDiv>
	)
}

const LandScapeDiv = styled.div`
	display: flex;
	flex-direction: column;

	justify-content: center;
`
