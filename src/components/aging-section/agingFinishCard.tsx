import {Button, Stack} from "react-bootstrap"
import {MeatInfoAiO, MeatInfoWithEntry} from "../../utils/types/meatTypes"
import {TiDeleteOutline} from "react-icons/ti"
import {backgroundColors} from "../../utils/consts/colors"
import {useState} from "react"

type AgingCardType = {
	meatInfo: MeatInfoAiO
	isEditMode: boolean
	clickEvent: (meatInfo: MeatInfoAiO) => void
	onClickDelete: (meatInfo: MeatInfoAiO) => void
}

type AgingTabType = {
	data: MeatInfoAiO[]
	isEditMode: boolean
	clickEvent: (item: MeatInfoAiO) => void
	onClickDelete: (meatInfo: MeatInfoAiO) => void
}

export const AgingCardsTab = (props: AgingTabType) => {
	const [show, setShow] = useState(false)

	return (
		<div>
			<div
				style={{
					border: "1px black solid",
					padding: "4px",
					paddingLeft: "8px",
					marginTop: "4px",
					marginBottom: "4px",
					backgroundColor: backgroundColors.agedCard,
					borderRadius: "6px",
				}}
				onClick={() => setShow(!show)}>
				<span style={{fontWeight: "700"}}>{props.data[0].meatNumber}</span> /{" "}
				<span style={{fontWeight: "700"}}>{props.data[0].cut}</span>
				<br />첫 입고일
				{props.data[0].storedDate}
			</div>
			<div
				style={{
					display: show ? "flex" : "none",
					flexDirection: "column",
					justifyContent: "center",
				}}>
				{props.data
					.sort(
						(a, b) =>
							parseInt(a.entry.split("/")[0]) - parseInt(b.entry.split("/")[0]),
					)
					.map((item) => (
						<AgingFinishCard
							meatInfo={item}
							isEditMode={props.isEditMode}
							clickEvent={props.clickEvent}
							onClickDelete={props.onClickDelete}
						/>
					))}
			</div>
		</div>
	)
}

export const AgingFinishCard = (props: AgingCardType) => {
	const {meatInfo, isEditMode, clickEvent, onClickDelete} = props

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginBottom: "3px",
			}}>
			{meatInfo && (
				<div
					style={{
						backgroundColor: backgroundColors.agedCard,
						width: "320px",
						padding: "10px",
						alignItems: "center",
						justifyContent: "space-between",
						border: "1px solid #234234",
						borderRadius: "5px",
					}}>
					<div
						style={{
							height: "30px",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}>
						<h6 style={{margin: 0}}>이력번호: {meatInfo.meatNumber}</h6>
						<TiDeleteOutline
							style={{
								display: isEditMode ? "flex" : "none",
								width: "30px",
								height: "30px",
								color: "#f74f32",
							}}
							onClick={() => onClickDelete(meatInfo)}
						/>
					</div>

					<hr style={{height: "1px", margin: "8px"}} />
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}>
						<Stack style={{width: "40%"}} gap={2}>
							<div>
								<h6>입고일:</h6>
								<h6>{meatInfo.storedDate}</h6>
							</div>
							<div>
								<h6>숙성시작일:</h6>
								<h6 style={{fontWeight: "700"}}>{meatInfo.agingDate}</h6>
							</div>
							<h6>육종: {meatInfo.species}</h6>
							<h6 style={{fontWeight: "700"}}>부위: {meatInfo.cut}</h6>
							<h6>등급: {meatInfo.grade ? meatInfo.grade : "-"}</h6>
							<h6>순번: {String(meatInfo.entry).padStart(3, "0")}</h6>{" "}
						</Stack>
						<div className="vr" style={{width: "1px", margin: "4px"}} />
						<Stack style={{width: "33%"}} gap={2}>
							{" "}
							<h6>단가: {meatInfo.price ? meatInfo.price : "-"}</h6>
							<h6>냉장: {meatInfo.freeze ? meatInfo.freeze : "-"}</h6>
							<h6>
								원산지:
								{meatInfo.origin ? meatInfo.origin : "-"}
							</h6>
							<div>
								<h6>암수:</h6>
								<h6> {meatInfo.gender ? meatInfo.gender : "-"}</h6>
							</div>
							<div style={{display: "flex"}}>
								<h6>냉장고:</h6>
								<h6 style={{fontWeight: "700"}}>
									{meatInfo.fridgeName ? meatInfo.fridgeName : "-"}
								</h6>
							</div>
							<div style={{display: "flex"}}>
								<h6>층:</h6>
								<h6 style={{fontWeight: "700"}}>
									{meatInfo.floor ? meatInfo.floor : "-"}
								</h6>
							</div>
							<div style={{display: "flex"}}>
								<h6>무게(g):</h6>
								<h6 style={{fontWeight: "700"}}>
									{meatInfo.beforeWeight ? meatInfo.beforeWeight : "-"}
								</h6>
							</div>
							{/* <h6>초음파: {meatInfo.ultraTime}</h6> */}
						</Stack>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}>
							<Button
								disabled={checkNullAgingInfo(meatInfo)}
								style={{
									width: "60px",
									height: "80px",
									padding: 0,
								}}
								onClick={() => clickEvent(meatInfo)}
								variant="danger">
								결과
								<br />
								입력
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function checkNullAgingInfo(info: MeatInfoWithEntry): boolean {
	return (
		info.beforeWeight === null ||
		info.fridgeName === null ||
		info.floor === null ||
		info.agingDate === null
	)
}
