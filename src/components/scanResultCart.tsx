import { useState } from "react"
import { ScanResultBox } from "./scanResultBox"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { MeatInfo, MeatScanned } from "../utils/types/meatTypes"
import { BsDashSquareFill, BsFillPlusSquareFill } from "react-icons/bs"

type ScannedItemsAndCount = {
    items: Map<MeatInfo, number>
    modifyHash: (value: React.SetStateAction<Map<MeatInfo, number>>) => void
}

export const ScanResultCart = (props: ScannedItemsAndCount) => {
    const { items, modifyHash } = props
    const list = Array.from(items).map((item) => {
        return (
            <MeatCartItem
                key={item[0].meatNumber}
                item={item}
                modifyHash={modifyHash}
            />
        )
    })
    return <Stack gap={4}>{list}</Stack>
}

type CartItem = {
    item: [MeatInfo, number]
    modifyHash: (value: React.SetStateAction<Map<MeatInfo, number>>) => void
}

const MeatCartItem = (props: CartItem) => {
    const { item, modifyHash } = props
    const meatInfo = item[0]
    const count = item[1]
    const onClickIncrease = () => {
        modifyHash((prev) => new Map([...prev, [meatInfo, count + 1]]))
    }
    const onClickDecrease = () => {
        if (count > 1) {
            modifyHash((prev) => new Map([...prev, [meatInfo, count - 1]]))
        }
    }
    return (
        <div>
            <ScanResultBox
                meatNumber={meatInfo.meatNumber ? meatInfo.meatNumber : "null"}
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
                    <h5>{count}개</h5>
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
