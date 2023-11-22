import { useState } from "react"
import {
    Button,
    Col,
    Dropdown,
    FloatingLabel,
    Form,
    Row,
    Stack,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import DatePickerComponent from "../storage-section/datePicker"
import { finishAging } from "../../apis/agingApi"
import { MeatInfoAiO, MeatInfoWithEntry } from "../../utils/types/meatTypes"
import moment from "moment"

type FinishAgingFormOptions = {
    finishDate: string
    afterWeight: number
    cutWeight: number
}

type FinishAgingParams = {
    meatInfo: MeatInfoWithEntry
    finishAgingEvent: (meatInfo: MeatInfoWithEntry) => void
}

export default function FinishAgingModal(props: FinishAgingParams) {
    const { meatInfo, finishAgingEvent } = props

    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<number>(new Date().getHours())
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
    } = useForm<FinishAgingFormOptions>({
        mode: "onSubmit",
        defaultValues: {
            afterWeight: undefined,
            finishDate:
                moment(date).format("YYYY-MM-DD ") +
                time.toString().padStart(2, "0"),
            cutWeight: undefined,
        },
    })

    const onSubmit = (data: FinishAgingFormOptions) => {
        let aIO: MeatInfoAiO = {
            ...meatInfo,
            finishDate: data.finishDate,
            afterWeight: data.afterWeight,
            cutWeight: data.cutWeight,
        }
        finishAging(aIO, finishAgingEvent(meatInfo))
    }
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <h6>숙성 종료 시각</h6>
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
            <Form.Group style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Stack gap={2}>
                    <FloatingLabel label='숙성 후 무게(g)'>
                        <Form.Control
                            type='number'
                            placeholder='AfterWeight'
                            {...register("afterWeight", {
                                required: `숙성 후 무게를 입력해주세요 ${watch(
                                    "afterWeight"
                                )}`,
                            })}
                        />
                        {errors.afterWeight?.type === "required" && (
                            <h6 style={{ color: "red" }}>
                                ※무게를 입력해주세요
                            </h6>
                        )}
                    </FloatingLabel>
                    <FloatingLabel label='손질 후 무게(g)'>
                        <Form.Control
                            type='number'
                            placeholder='CutWeight'
                            {...register("cutWeight", {
                                required: `손질 후 무게를 입력해주세요 ${watch(
                                    "cutWeight"
                                )}`,
                            })}
                        />
                        {errors.cutWeight?.type === "required" && (
                            <h6 style={{ color: "red" }}>
                                ※무게를 입력해주세요
                            </h6>
                        )}
                    </FloatingLabel>
                </Stack>
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
