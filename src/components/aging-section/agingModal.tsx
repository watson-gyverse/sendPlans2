import { Col, Dropdown, FloatingLabel, Row } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import {
    BeefOriginAndGrades,
    PorkOriginAndGrades,
} from "../../utils/consts/meat"
import { useEffect, useState } from "react"
import {
    MeatInfo,
    MeatInfoWithCount,
    MeatInfoWithEntry,
} from "../../utils/types/meatTypes"
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
    place: string
    setMeatInfo: (mInfo: MeatInfoWithEntry) => void
    setClose: () => void
}

function AgingModal(props: ModalParams) {
    const { meatInfo, setMeatInfo, setClose } = props
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
            place: props.place,
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
                <FloatingLabel label='냉장고'>
                    <Form.Control
                        type=''
                        placeholder='fridgeName'
                        {...register("fridgeName", {
                            required: `냉장고 이름을 입력해주세요 ${watch(
                                "fridgeName"
                            )}`,
                        })}
                    />
                    {errors.fridgeName?.type === "required" && (
                        <h6 style={{ color: "red" }}>
                            ※냉장고이름을 입력해주세요
                        </h6>
                    )}
                </FloatingLabel>
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
                Submit
            </Button>
        </Form>
    )
}

export default AgingModal
