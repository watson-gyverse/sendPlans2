import {ReactNode} from "react"
type ModalChildren = {
	children: ReactNode
}
export const StockModal = ({children}: ModalChildren) => {
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
					width: "66%",
					height: "40%",
					minWidth: "10rem",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#d3d3d3",
				}}>
				{children}
			</div>
		</div>
	)
}
