import {ReactNode, useEffect, useRef} from "react"
type ModalChildren = {
	children: ReactNode
	setOpen: (isOpen: boolean) => void
	closableAtOutside?: boolean
}
export const StockModal = ({
	children,
	setOpen,
	closableAtOutside = true,
}: ModalChildren) => {
	// const isMobile = useMediaQuery({query: "(max-width: 1224px)"})

	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (
				closableAtOutside &&
				modalRef.current &&
				!modalRef.current.contains(e.target)
			) {
				setOpen(false)
			}
		}
		const handleEscapeKey = (e: any) => {
			if (e.key === "Escape") {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("keydown", handleEscapeKey)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("keydown", handleEscapeKey)
		}
	}, [])

	return (
		<div
			// className="modal"
			style={{
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				justifyContent: "center",
				zIndex: 1,
				left: 0,
				top: 0,
				width: "100%",
				height: "100vh",
				backgroundColor: "rgba(0, 0, 0, 0.4)",
			}}>
			<div
				className="modal-content"
				style={{
					border: "6px #c13523 solid",
					padding: "20px 10px",
					width: "auto",
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					backgroundColor: "#ededed",
				}}
				ref={modalRef}>
				{children}
			</div>
		</div>
	)
}
