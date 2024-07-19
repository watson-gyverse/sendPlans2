import {useEffect, useState} from "react"
import {StockCategory, StockProduct} from "../../utils/types/stockTypes"
import {useMediaQuery} from "react-responsive"

type TStockCatDiv = {
	onProductClick: (docId: string, catName: string, pd: StockProduct) => void
	isEditMode: boolean
	onExchangeProductOrderClick: (
		catId: string,
		lPd: StockProduct,
		rPd: StockProduct,
	) => void
	onShowAddPrdModal: (id: string) => void
	data: StockCategory[]
	onExchangeCategoryOrderClick: (nCatId: string, sCatId: string) => void
	datum: StockCategory
	idx: number
}
export const StockCatDiv = (props: TStockCatDiv) => {
	const {
		onProductClick,
		isEditMode,
		onExchangeProductOrderClick,
		onShowAddPrdModal,
		data,
		onExchangeCategoryOrderClick,
		datum,
		idx,
	} = props

	const isMobile = useMediaQuery({query: "(max-width: 1440px)"})

	useEffect(() => {
		if (!isMobile) {
			setOpen(true)
		}
	}, [isMobile])
	const [isOpen, setOpen] = useState(true)
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				maxWidth: "1200px",
			}}>
			<div
				onClick={() => isMobile && setOpen(!isOpen)}
				style={{
					width: "100%",
					minHeight: "1rem",
					border: "1px solid #545454",
					marginTop: "10px",
					backgroundColor: "#faf9f9",
					borderRadius: "4px",
					paddingLeft: "4px",
				}}>
				{datum.catName}
			</div>
			<div style={{display: isOpen ? "flex" : "none"}}>
				<StockProductList
					isMobile={isMobile}
					onProductClick={onProductClick}
					datum={datum}
					isEditMode={isEditMode}
					onExchangeProductOrderClick={onExchangeProductOrderClick}
				/>
				{isEditMode && (
					<button
						className="btn-two green large"
						onClick={() => onShowAddPrdModal(datum.docId)}
						style={{
							width: "10rem",
							padding: "10px",
							maxHeight: "8rem",
						}}>
						항목
						<br />
						추가하기
					</button>
				)}
			</div>
			{isEditMode && idx < data.length - 1 && (
				<div
					style={{
						display: "flex",
						width: "100%",
						justifyContent: "center",
					}}>
					<button
						style={{width: "40%"}}
						onClick={() =>
							onExchangeCategoryOrderClick(data[idx].docId, data[idx + 1].docId)
						}>
						↕
					</button>
				</div>
			)}
		</div>
	)
}
type TStockPList = {
	isMobile: boolean
	onProductClick: (docId: string, catName: string, pd: StockProduct) => void
	datum: StockCategory
	isEditMode: boolean
	onExchangeProductOrderClick: (
		catId: string,
		lPd: StockProduct,
		rPd: StockProduct,
	) => void
}
const StockProductList = (props: TStockPList) => {
	const {
		isMobile,
		onProductClick,
		datum,
		isEditMode,
		onExchangeProductOrderClick,
	} = props
	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				whiteSpace: isMobile ? "normal" : "nowrap",
				flexWrap: isMobile ? "wrap" : "nowrap",
				overflow: "scroll",
				overflowX: "auto",
				overflowY: "hidden",
				msOverflowStyle: isMobile ? "none" : "scrollbar",
				scrollbarWidth: isMobile ? "none" : "thin",
				borderBottom: "1px black solid",
				paddingBottom: "4px",
				marginBottom: "4px",
				backgroundColor: "#fafafa",
			}}>
			{datum.products &&
				datum.products
					.sort((a, b) => a.prdOrder - b.prdOrder)
					.map((pd, idx) => (
						<div
							style={{
								display: "flex",
								width: "auto",
							}}>
							<button
								className="btn-two orange large"
								style={{
									maxWidth: "13rem",
									width: isMobile ? "7rem" : "150px",
									padding: "6px",
									height: "8rem",
									maxHeight: "8rem",
									backgroundColor:
										pd.color && pd.color !== ""
											? pd.color.charAt(0) === "#"
												? `${pd.color}`
												: `#${pd.color}`
											: undefined,
								}}
								onClick={() => onProductClick(datum.docId, datum.catName, pd)}>
								<h4
									style={{
										whiteSpace: "pre-wrap",
										margin: "0px",
										wordBreak: isMobile ? "break-all" : "normal",
									}}>
									{pd.prdName}
								</h4>
								<h5 style={{margin: "0"}}>재고:{pd.prdCnt}개</h5>
							</button>
							{isEditMode && idx < datum.products.length - 1 && (
								<button
									onClick={() =>
										onExchangeProductOrderClick(
											datum.docId,
											datum.products[idx],
											datum.products[idx + 1],
										)
									}>
									{"↔"}
								</button>
							)}
						</div>
					))}
		</div>
	)
}
