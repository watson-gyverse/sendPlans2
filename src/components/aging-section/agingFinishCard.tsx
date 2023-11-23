import { Button, Stack } from "react-bootstrap"
import toast from "react-hot-toast"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { TiDeleteOutline } from "react-icons/ti"
import { backgroundColors } from "../../utils/consts/colors"

type AgingCardType = {
    meatInfo: MeatInfoWithEntry
    isEditMode: boolean
    clickEvent: () => void
    onClickDelete: (meatInfo: MeatInfoWithEntry) => void
}

export const AgingFinishCard = (props: AgingCardType) => {
    const { meatInfo, isEditMode, clickEvent, onClickDelete } = props

    return (
        <div>
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
                    }}
                >
                    <div
                        style={{
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <h6 style={{ margin: 0 }}>
                            이력번호: {meatInfo.meatNumber}
                        </h6>
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

                    <hr style={{ height: "1px", margin: "8px" }} />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Stack
                            style={{ width: "40%" }}
                            gap={2}
                        >
                            <h6>입고일:</h6>
                            <h6>{meatInfo.storedDate}</h6>
                            <h6>숙성시작일:</h6>
                            <h6>{meatInfo.agingDate}</h6>
                            <h6>육종: {meatInfo.species}</h6>
                            <h6>부위: {meatInfo.cut}</h6>
                            <h6>
                                등급: {meatInfo.grade ? meatInfo.grade : "-"}
                            </h6>
                            <h6>
                                순번: {String(meatInfo.entry).padStart(3, "0")}
                            </h6>{" "}
                        </Stack>
                        <div
                            className='vr'
                            style={{ width: "1px", margin: "4px" }}
                        />
                        <Stack
                            style={{ width: "33%" }}
                            gap={2}
                        >
                            {" "}
                            <h6>
                                단가: {meatInfo.price ? meatInfo.price : "-"}
                            </h6>
                            <h6>
                                냉장: {meatInfo.freeze ? meatInfo.freeze : "-"}
                            </h6>
                            <h6>
                                원산지:
                                {meatInfo.origin ? meatInfo.origin : "-"}
                            </h6>
                            <h6>
                                암수: {meatInfo.gender ? meatInfo.gender : "-"}
                            </h6>
                            <h6>
                                냉장고:
                                {meatInfo.fridgeName
                                    ? meatInfo.fridgeName
                                    : "-"}
                            </h6>
                            <h6>층: {meatInfo.floor ? meatInfo.floor : "-"}</h6>
                            <h6>
                                무게(g):
                                {meatInfo.beforeWeight
                                    ? meatInfo.beforeWeight
                                    : "-"}
                            </h6>
                            <h6>초음파: {meatInfo.ultraTime}</h6>
                        </Stack>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                disabled={checkNullAgingInfo(meatInfo)}
                                style={{
                                    width: "60px",
                                    height: "80px",
                                    padding: 0,
                                }}
                                onClick={clickEvent}
                                variant='danger'
                            >
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
