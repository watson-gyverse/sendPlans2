import {ReactNode} from "react"
import {useMediaQuery} from "react-responsive"
type ModalChildren = {
	children: ReactNode
}
export const StockModal = ({children}: ModalChildren) => {
	const isMobile = useMediaQuery({query: "(max-width: 1224px)"})
	return (
		<div
			// className="modal"
			style={{
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: 1,
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				overflow: "auto",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
			}}>
			<div
				className="modal-content"
				style={{
					border: "6px #c13523 solid",
					width: isMobile ? "66%" : "25%",
					height: "40%",
					minWidth: "10rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#ededed",
				}}>
				{children}
			</div>
		</div>
	)
}
