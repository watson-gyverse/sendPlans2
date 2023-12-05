import { useState } from "react"
import { Button, FloatingLabel, Form, Modal, Stack } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { finishAging } from "../../apis/agingApi"
import { MeatInfoAiO, MeatInfoWithEntry } from "../../utils/types/meatTypes"
import moment from "moment"
import { DatePickerSet } from "../common/datePickerSet"

type FinishAgingFormOptions = {
    finishDate: string
    afterWeight: number
    cutWeight: number
}

type FinishAgingParams = {
    meatInfo: MeatInfoWithEntry
    finishAgingEvent: (meatInfo: MeatInfoWithEntry) => void
    show: boolean
    setShow: (show: boolean) => void
}

export default function FinishAgingModal(props: FinishAgingParams) {
    const { meatInfo, finishAgingEvent, show, setShow } = props

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
        const ok = window.confirm("정말 숙성 종료합니다?")
        if (ok) {
            let aIO: MeatInfoAiO = {
                ...meatInfo,
                finishDate: data.finishDate,
                afterWeight: data.afterWeight,
                cutWeight: data.cutWeight,
            }
            finishAging(aIO, finishAgingEvent(meatInfo))
        }
    }
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>숙성 완료</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h6>숙성 종료 시각</h6>
                    <DatePickerSet dateData={dateData} />

                    <Form.Group
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
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
            </Modal.Body>
        </Modal>
    )
}
