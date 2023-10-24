import { ScanResultBox } from "./scanResultBox"
import { Col, Row, Stack } from "react-bootstrap"
import { MeatInfoWithCount } from "../../utils/types/meatTypes"
import { BsDashSquareFill, BsFillPlusSquareFill } from "react-icons/bs"

type ScannedItemsAndCount = {
    items: Map<string, MeatInfoWithCount>
    modifyHash: (
        value: React.SetStateAction<Map<string, MeatInfoWithCount>>
    ) => void
}

export const ScanResultCart = (props: ScannedItemsAndCount) => {
    const { items, modifyHash } = props
    const list = Array.from(items).map((item) => {
        return (
            <MeatCartItem
                key={item[0]}
                item={item}
                modifyHash={modifyHash}
            />
        )
    })
    return <Stack gap={4}>{list}</Stack>
}

type CartItem = {
    item: [string, MeatInfoWithCount]
    modifyHash: (
        value: React.SetStateAction<Map<string, MeatInfoWithCount>>
    ) => void
}

const MeatCartItem = (props: CartItem) => {
    const { item, modifyHash } = props
    const meatNumber = item[0]
    const meatInfo = item[1]
    const onClickIncrease = () => {
        let plus1 = Object.assign(meatInfo)
        plus1.count = meatInfo.count + 1
        modifyHash((prev) => new Map([...prev, [meatNumber, plus1]]))
    }
    const onClickDecrease = () => {
        if (meatInfo.count > 1) {
            let plus1 = Object.assign(meatInfo)
            plus1.count = meatInfo.count - 1
            modifyHash((prev) => new Map([...prev, [meatNumber, plus1]]))
        }
    }
    return (
        <div>
            <ScanResultBox
                meatNumber={meatNumber ? meatNumber : "null"}
                species={meatInfo.species}
                grade={meatInfo.grade ? meatInfo.grade : "null"}
                gender={meatInfo.gender ? meatInfo.gender : "null"}
            />
            <Row
                style={{
                    display: "flex",
                    paddingTop: "10px",
                    alignItems: "center",
                }}
            >
                <Col
                    style={{
                        display: "flex",
                        textAlign: "center",
                        alignItems: "center",
                    }}
                >
                    <h6 style={{ marginLeft: "10px", marginRight: "6px" }}>
                        ▲ 동일 수량:
                    </h6>
                    <h5>{meatInfo.count}개</h5>
                </Col>
                <Col
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Row>
                        <Col>
                            <BsDashSquareFill
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    color: "#0b5ed7",
                                }}
                                onClick={onClickDecrease}
                            />
                        </Col>
                        <Col>
                            <BsFillPlusSquareFill
                                style={{
                                    width: "3rem",
                                    height: "3rem",
                                    color: "#0b5ed7",
                                }}
                                onClick={onClickIncrease}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
