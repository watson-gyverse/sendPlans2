import { ScanResultBox } from "./scanResultBox"
import { Col, Row, Stack } from "react-bootstrap"
import { MeatInfoWithCount } from "../../utils/types/meatTypes"
import { BsDashSquareFill, BsFillPlusSquareFill } from "react-icons/bs"
import _ from "lodash"
import { TiDeleteOutline } from "react-icons/ti"

type ScannedItemsAndCount = {
    // items: Map<string, MeatInfoWithCount>
    items: MeatInfoWithCount[]
    modifyItems: (value: React.SetStateAction<MeatInfoWithCount[]>) => void
}

export const ScanResultCart = (props: ScannedItemsAndCount) => {
    const { items, modifyItems } = props
    const list = Array.from(items).map((item) => {
        return (
            <MeatCartItem
                key={item.meatNumber}
                item={item}
                modifyItems={modifyItems}
            />
        )
    })
    return <Stack gap={4}>{list}</Stack>
}

type CartItem = {
    item: MeatInfoWithCount
    modifyItems: (value: React.SetStateAction<MeatInfoWithCount[]>) => void
}

const MeatCartItem = (props: CartItem) => {
    const { item, modifyItems: modifyItems } = props
    const meatNumber = item.meatNumber
    const meatInfo = item
    const onClickIncrease = () => {
        let plus1 = Object.assign(meatInfo)
        plus1.count = meatInfo.count + 1
        modifyItems((prev) => [
            ...prev.filter((it) => it.meatNumber !== meatNumber),
            plus1,
        ])
    }
    const onClickDecrease = () => {
        if (meatInfo.count > 1) {
            let plus1 = Object.assign(meatInfo)
            plus1.count = meatInfo.count - 1
            modifyItems((prev) => [
                ...prev.filter((it) => it.meatNumber !== meatNumber),
                plus1,
            ])
        }
    }

    const onClickDelete = () => {
        const ok = window.confirm("장바구니에서 삭제합니다?")

        if (ok) {
            modifyItems((prev) => [
                ...prev.filter((it) => it.meatNumber != meatNumber),
            ])
        }
    }
    return (
        <div>
            <TiDeleteOutline
                style={{
                    width: "30px",
                    height: "30px",
                    color: "#f74f32",
                }}
                onClick={onClickDelete}
            />
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
