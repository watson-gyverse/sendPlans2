import {PropsWithChildren} from "react"
import styled from "styled-components"

interface PortraitProps {
	bgColor: string
	padding: string
}

export const PortraitDiv = (props: PropsWithChildren<PortraitProps>) => {
	return (
		<PortraitContainer>
			<StyledPortraitDiv bgColor={props.bgColor} padding={props.padding}>
				{props.children}
			</StyledPortraitDiv>
		</PortraitContainer>
	)
}

export const StyledPortraitDiv = styled.div<PortraitProps>`
	background-color: ${(props) => props.bgColor};
	padding: ${(props) => props.padding};
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
`

export const StyledHeader = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: auto;
	width: 100%;
	padding: 5px;
`

const PortraitContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 480px;
	justify-content: center;
	align-items: center;
`
