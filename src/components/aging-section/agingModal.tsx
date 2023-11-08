import { Col, Dropdown, FloatingLabel, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { MeatInfoWithEntry } from "../../utils/types/meatTypes"
import DatePickerComponent from "../storage-section/datePicker"
import moment from "moment"

type AgingFormOptions = {
    fridgeName: string
    floor: number
    beforeWeight: number
    agingDate: string
}

type ModalParams = {
    meatInfo: MeatInfoWithEntry
    placeName: string
    placeCount: number
    setMeatInfo: (mInfo: MeatInfoWithEntry) => void
    setClose: () => void
}

function AgingModal(props: ModalParams) {
    const { meatInfo, placeName, placeCount, setMeatInfo, setClose } = props
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<number>(new Date().getHours())

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
                time.toString().padStart(2, "0"),
        }
        setMeatInfo(newInfo)
        setClose()
    }

    const onError = (error: any) => {
        console.log("ERROR:::", error)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <h6>숙성 시작 시각</h6>
            <Row>
                <Col>
                    <DatePickerComponent
                        targetDate={date}
                        setTargetDate={setDate}
                    />
                </Col>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle
                            style={{
                                fontSize: "1.5rem",
                            }}
                            id='dropdown-hour'
                        >{`${time}시`}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Array.from({ length: 24 }, (_, i) => (
                                <Dropdown.Item onClick={() => setTime(i)}>
                                    {i}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Form.Group className='mb-3'>
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
                        냉장고 번호:
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
                <h6>층</h6>
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

            <Button
                variant='primary'
                type='submit'
            >
                적용
            </Button>
        </Form>
    )
}

export default AgingModal
