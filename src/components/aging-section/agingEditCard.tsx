import { Button, Stack } from "react-bootstrap"
import toast from "react-hot-toast"
import {
    MeatInfo,
    MeatInfoWithCount,
    MeatInfoWithEntry,
} from "../../utils/types/meatTypes"

type EditCardType = {
    meatInfo: MeatInfoWithEntry
    clickEvent: () => void
}

export const AgingEditCard = (props: EditCardType) => {
    const { meatInfo, clickEvent } = props

    return (
        <div>
            {meatInfo && (
                <div
                    style={{
                        backgroundColor: "#b3d7ef",
                        padding: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #234234",
                        borderRadius: "5px",
                    }}
                >
                    <h6>이력번호: {meatInfo.meatNumber}</h6>
                    <hr style={{ height: "1px", margin: "8px" }} />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Stack
                            style={{ width: "30%" }}
                            gap={1}
                        >
                            <h6>입고일:</h6>
                            <h6>{meatInfo.storedDate}</h6>
                            <h6>육종: {meatInfo.species}</h6>
                            <h6>부위: {meatInfo.cut}</h6>
                            <h6>
                                등급: {meatInfo.grade ? meatInfo.grade : "-"}
                            </h6>
                            <h6>
                                순번: {String(meatInfo.entry).padStart(3, "0")}
                            </h6>{" "}
                            <h6>
                                단가: {meatInfo.price ? meatInfo.price : "-"}
                            </h6>
                        </Stack>
                        <div
                            className='vr'
                            style={{ width: "1px", margin: "4px" }}
                        />
                        <Stack
                            style={{ width: "33%" }}
                            gap={2}
                        >
                            {/* <h6>무게: 1234g</h6> */}

                            <h6>
                                냉장: {meatInfo.freeze ? meatInfo.freeze : "-"}
                            </h6>
                            <h6>
                                원산지:{" "}
                                {meatInfo.origin ? meatInfo.origin : "-"}
                            </h6>
                            <h6>
                                암수: {meatInfo.gender ? meatInfo.gender : "-"}
                            </h6>
                            <h6>
                                냉장고:{" "}
                                {meatInfo.fridgeName
                                    ? meatInfo.fridgeName
                                    : "-"}
                            </h6>
                            <h6>층: {meatInfo.floor ? meatInfo.floor : "-"}</h6>
                            <h6>
                                무게:{" "}
                                {meatInfo.beforeWeight
                                    ? meatInfo.beforeWeight
                                    : "-"}
                            </h6>
                        </Stack>
                        <Button
                            style={{ width: "100px", height: "100px" }}
                            onClick={clickEvent}
                        >
                            숙성정보
                            <br />
                            입력
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
