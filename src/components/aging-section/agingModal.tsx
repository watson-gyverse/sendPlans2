import { FloatingLabel } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import moment from "moment"
import { DatePickerSet } from "../common/datePickerSet"

type AgingFormOptions = {
    fridgeName: string
    floor: number
    beforeWeight: number
    agingDate: string
    ultraTime: number
}

type AgingModalParams = {
    meatInfo: MeatInfoWithEntry
    placeName: string
    placeCount: number
    setMeatInfo: (mInfo: MeatInfoWithEntry) => void
    setClose: () => void
}

function AgingModal(props: AgingModalParams) {
    const { meatInfo, placeName, placeCount, setMeatInfo, setClose } = props
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<number>(new Date().getHours())
    const [amPm, setAmPm] = useState(false) //true : am , false : pm

    const dateData = {
        date: date,
        setDate: setDate,
        time: time,
        setTime: setTime,
        amPm: amPm,
        setAmPm: setAmPm,
        variant: "danger",
    }

    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
    } = useForm<AgingFormOptions>({
        mode: "onSubmit",
        defaultValues: {
            agingDate: "",
            fridgeName: "",
            floor: undefined,
            beforeWeight: undefined,
            ultraTime: 0,
        },
    })
    const onSubmit = (data: AgingFormOptions) => {
        console.log("data submitted")
        console.log(data)
        const newInfo = {
            ...meatInfo,
            beforeWeight: data.beforeWeight,
            fridgeName: data.fridgeName,
            floor: data.floor,
            place: placeName,
            agingDate:
                moment(date).format("YYYY-MM-DD ") +
                (amPm ? time : time + 12).toString().padStart(2, "0"),
            ultraTime: data.ultraTime,
        }
        setMeatInfo(newInfo)
        setClose()
    }

    const onError = (error: any) => {
        console.log("ERROR:::", error)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <h4 style={{ fontWeight: "800" }}>숙성 시작 시각</h4>
            <DatePickerSet dateData={dateData} />

            <Form.Group
                className='mb-3'
                style={{ marginTop: "10px" }}
            >
                <FloatingLabel label='무게(g)'>
                    <Form.Control
                        type='number'
                        placeholder='BeforeWeight'
                        {...register("beforeWeight", {
                            required: `숙성 전 무게를 입력해주세요 ${watch(
                                "beforeWeight"
                            )}`,
                        })}
                    />
                    {errors.beforeWeight?.type === "required" && (
                        <h6 style={{ color: "red" }}>※무게를 입력해주세요</h6>
                    )}
                </FloatingLabel>
                <Form.Group>
                    <Form.Label
                        style={{
                            width: "auto",
                            marginTop: "10px",
                            marginRight: "12px",
                        }}
                    >
                        <p style={{ fontWeight: "800" }}> 냉장고 번호:</p>
                    </Form.Label>
                    {Array.from({ length: placeCount }, (_, i) => {
                        let a = i + 1
                        return (
                            <Form.Check
                                inline
                                type='radio'
                                label={a}
                                {...register("fridgeName", {
                                    required: "보관방식을 입력해주세요",
                                })}
                                value={a}
                                name='fridgeName'
                                id={"fridgeName" + a}
                            />
                        )
                    })}

                    {errors.fridgeName?.type === "required" &&
                        watch("fridgeName") === "" && (
                            <h6 style={{ color: "red" }}>
                                ※냉장고 번호를 입력해주세요
                            </h6>
                        )}
                </Form.Group>
            </Form.Group>
            <Form.Group>
                <p style={{ fontWeight: "800" }}> 냉장고 층:</p>
                <Form.Select
                    aria-label='floor'
                    {...register("floor", { required: true })}
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <option
                            key={5 - i}
                            value={5 - i}
                        >
                            {5 - i}
                        </option>
                    ))}
                </Form.Select>
                {errors.floor?.type === "required" &&
                    watch("floor") === undefined && (
                        <h6 style={{ color: "red" }}>※층을 입력해주세요</h6>
                    )}
            </Form.Group>
            <Form.Group style={{ marginTop: "10px" }}>
                <Form.Label style={{ marginRight: "12px" }}>
                    <p style={{ fontWeight: "800" }}> 초음파 가동 시간:</p>
                </Form.Label>
                {Array.from({ length: 6 }, (_, i) => {
                    let a = i
                    return (
                        <Form.Check
                            inline
                            type='radio'
                            label={a}
                            {...register("ultraTime", {})}
                            value={a}
                            name='ultraTime'
                            id={"ultraTime" + a}
                        />
                    )
                })}
            </Form.Group>
            <div
                style={{
                    display: "flex",
                    justifyContent: "right",
                }}
            >
                <Button
                    variant='danger'
                    type='submit'
                    style={{
                        width: "157px",
                        height: "50px",
                    }}
                >
                    적용
                </Button>
            </div>
        </Form>
    )
}

export default AgingModal
