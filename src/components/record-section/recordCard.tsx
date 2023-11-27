import { Button } from "react-bootstrap"
import { MeatInfoAiO } from "../../utils/types/meatTypes"

type CardItem = {
    item: MeatInfoAiO
}

export const RecordCard = (props: CardItem) => {
    const { item } = props
    const categoryStyle = {
        fontWeight: "600",
        margin: "0",
    }
    return (
        <div
            style={{
                backgroundColor: "#ffe7f9",
                width: "100%",
                margin: "10px 0px",
                padding: "6px 4px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h6 style={categoryStyle}>이력번호: {item.meatNumber}</h6>
                <h6 style={categoryStyle}>냉:{item.fridgeName}</h6>
                <h6 style={categoryStyle}>층:{item.floor}</h6>
                <Button
                    style={{ width: "50px", height: "30px", padding: 0 }}
                    variant='warning'
                >
                    <p style={{ fontSize: "0.8rem", margin: "0" }}>자세히</p>
                </Button>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                }}
            >
                <div>
                    <h6 style={categoryStyle}>입고시각 </h6>
                    <h6>{item.storedDate}</h6>
                    <h6 style={categoryStyle}>숙성시작 </h6>
                    <h6>{item.agingDate}</h6>
                    <h6 style={categoryStyle}>숙성종료 </h6>
                    <h6>{item.finishDate}</h6>
                </div>
                <div>
                    <h6>
                        {item.species} / {item.cut}
                    </h6>
                    <h6>
                        {item.origin} / {item.grade}
                    </h6>
                    <h6 style={categoryStyle}>무게(입고/숙성/손질)</h6>
                    <h6>
                        {item.beforeWeight} / {item.afterWeight} /{" "}
                        {item.cutWeight}
                    </h6>
                    <h6 style={categoryStyle}>무게변화율(숙성/손질)</h6>
                    <h6>
                        -
                        {(
                            (1 - item.afterWeight / item.beforeWeight!!) *
                            100
                        ).toFixed(2)}
                        % / -
                        {(
                            (1 - item.cutWeight / item.beforeWeight!!) *
                            100
                        ).toFixed(2)}
                        %
                    </h6>
                </div>
            </div>
        </div>
    )
}
