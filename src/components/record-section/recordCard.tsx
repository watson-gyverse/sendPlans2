import { MeatInfoAiO } from "../../utils/types/meatTypes"

type CardItem = {
    item: MeatInfoAiO
}

export const RecordCard = (props: CardItem) => {
    const { item } = props
    return (
        <div
            style={{
                backgroundColor: "#ffdaec",
                width: "100%",
                margin: "10px 0px",
                padding: "4px 6px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <h6>이력번호: {item.meatNumber}</h6>
                <h6>냉:{item.fridgeName}</h6>
                <h6>층:{item.floor}</h6>
                <button>자세히</button>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",

                    justifyContent: "space-evenly",
                }}
            >
                <div>
                    <h6>입고시각 </h6>
                    <h6>{item.storedDate}</h6>
                    <h6>숙성시작 </h6>
                    <h6>{item.agingDate}</h6>
                    <h6>숙성종료 </h6>
                    <h6>{item.finishDate}</h6>
                </div>
                <div>
                    <h6>
                        {item.species} / {item.cut}
                    </h6>
                    <h6>
                        {item.origin} / {item.grade}
                    </h6>
                    <h6>무게(입고/숙성/손질)</h6>
                    <h6>
                        {item.beforeWeight} / {item.afterWeight} /{" "}
                        {item.cutWeight}
                    </h6>
                    <h6>무게변화율(숙성/손질)</h6>
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
