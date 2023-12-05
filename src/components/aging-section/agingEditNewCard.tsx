import { Button, Stack } from "react-bootstrap"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import { useState } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { deleteFromStorage } from "../../apis/agingApi"
import { AgingEditContextType } from "../../contexts/agingEditContext"
import _ from "lodash"

interface IAgingCardProps {
    items: MeatInfoWithEntry[]
    agingEditProps: AgingEditContextType
}

export const NewAgingCard = (props: IAgingCardProps) => {
    const items = props.items
    const { checkedSList, setCheckedSList } = props.agingEditProps

    const [show, setShow] = useState(false)

    const onCheckAll = (checked: boolean) => {
        const mapped: string[] = _.map(items, "docId")
        if (checked) {
            const union = _.union(checkedSList, mapped)
            setCheckedSList(union)
        } else {
            const deleted = _.remove(checkedSList, (item) => {
                return _.includes(mapped, item)
            })
            console.log(deleted)
            console.log(checkedSList)
            setCheckedSList([...checkedSList])
        }
    }

    const checkAllChecked = () => {
        let allChecked = true
        items.forEach((item) => {
            if (!_.includes(checkedSList, item.docId)) {
                allChecked = false
            }
        })

        return allChecked
    }

    return (
        <Stack gap={2}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "right",
                }}
            >
                <input
                    type='checkbox'
                    id={"Sche" + items[0].meatNumber}
                    onChange={(e) => onCheckAll(e.target.checked)}
                    checked={checkAllChecked()}
                />
                <label htmlFor={"Sche" + items[0].meatNumber}>
                    <AgingEditCardHeader
                        item={items[0]}
                        show={show}
                        setShow={setShow}
                    />
                </label>
            </div>
            {show &&
                items.map((item) => {
                    return (
                        <NewAgingCardItem
                            item={item}
                            agingEditProps={props.agingEditProps}
                        />
                    )
                })}
        </Stack>
    )
}

interface INewAgingCardItem {
    item: MeatInfoWithEntry
    agingEditProps: AgingEditContextType
}

const NewAgingCardItem = (props: INewAgingCardItem) => {
    const item = props.item
    const {
        isEditMode,
        setRecentMeatInfo,
        setModalShow,
        fetch,
        onClickStartAging,
        checkedSList,
        setCheckedSList,
    } = props.agingEditProps

    const onClickDeleteButton = (item: MeatInfoWithEntry) => {
        const ok = window.confirm(
            "입고 중인 아이템입니다. 정말 삭제하시겠습니까?"
        )
        if (ok) {
            deleteFromStorage(item.docId!!, fetch())
        }
    }

    const onCheckElement = (checked: boolean, item: string) => {
        console.log(checked)
        if (checked) {
            setCheckedSList([...checkedSList, item])
        } else {
            const newList = _.without(checkedSList, item)
            setCheckedSList(newList)
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "right" }}>
            <input
                type='checkbox'
                id={"Sche" + item.docId}
                onChange={(e) => onCheckElement(e.target.checked, item.docId!!)}
                checked={_.includes(checkedSList, item.docId!!)}
            />
            <label htmlFor={"Sche" + item.docId}>
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#fff7f7",
                        width: "280px",
                        padding: "10px",
                        justifyContent: "space-between",
                        border: "1px solid #234234",
                        borderRadius: "5px",
                    }}
                >
                    <div>
                        <h5>순번: {item.entry}</h5>
                        <h6>숙성일: {item.agingDate ? item.agingDate : "-"}</h6>
                        <h6>
                            냉장고:{" "}
                            {item.fridgeName ? item.fridgeName + "번" : "-"},{" "}
                            {item.floor ? item.floor + "층" : "-"}
                        </h6>
                        <h6>
                            초음파:{" "}
                            {item.ultraTime ? item.ultraTime + "h" : "-"} /{" "}
                            {item.beforeWeight ? item.beforeWeight + "g" : "-"}
                        </h6>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                        }}
                    >
                        {isEditMode ? (
                            <TiDeleteOutline
                                onClick={() => onClickDeleteButton(item)}
                            />
                        ) : (
                            <></>
                        )}
                        <Button
                            variant='danger'
                            onClick={() => {
                                // onClickAddInfo()
                                setModalShow(true)
                                setRecentMeatInfo(item)
                            }}
                        >
                            정보입력
                        </Button>
                        <Button
                            variant='danger'
                            onClick={() => onClickStartAging(item)}
                        >
                            숙성시작
                        </Button>
                    </div>
                </div>
            </label>
        </div>
    )
}

interface IAgingEditCardHeader {
    item: MeatInfoWithEntry
    show: boolean
    setShow: (show: boolean) => void
}

const AgingEditCardHeader = (props: IAgingEditCardHeader) => {
    const { item, show, setShow } = props
    return (
        <div
            style={{
                display: "flex",
                backgroundColor: "#fff7f7",
                width: "310px",
                padding: "10px",
                alignItems: "stretch",
                flexDirection: "column",
                justifyContent: "left",
                border: "1px solid #234234",
                borderRadius: "5px",
            }}
        >
            <h5>이력번호: {item.meatNumber}</h5>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h6>입고일: {item.storedDate} </h6>
                    <h6>
                        {item.species} {item.cut} {item.freeze}
                    </h6>
                    <h6>
                        {item.origin} {item.grade}
                    </h6>
                    <h6>
                        {item.gender} {item.price}원
                    </h6>
                </div>

                <Button
                    variant='danger'
                    onClick={() => setShow(!show)}
                >
                    딸깍
                </Button>
            </div>
        </div>
    )
}
