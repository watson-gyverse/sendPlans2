import { FloatingLabel } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import {
    BeefOriginAndGrades,
    PorkOriginAndGrades,
} from "../../utils/consts/meat"
import { useEffect } from "react"
import { MeatInfo, MeatInfoWithCount } from "../../utils/types/meatTypes"

type AgingFormOptions = {
    fridgeName: string
    floor: number
    beforeWeight: number
    agingDate: string
}

type ModalParams = {
    meatInfo: MeatInfoWithCount
    place: string
    setMeatInfo: (mInfo: MeatInfoWithCount) => void
    setClose: () => void
}

function AgingModal(props: ModalParams) {
    const { meatInfo, setMeatInfo, setClose } = props
    const {
        register,
        formState: { errors },
        watch,
        reset,
        handleSubmit,
        getValues,
        setError,
        setFocus,
        control,
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
            agingDate: data.agingDate,
        }
        // meatInfo.price = data.price.toString()
        // meatInfo.freeze = data.freeze
        // meatInfo.gender = data.gender
        // meatInfo.grade = data.grade
        // meatInfo.origin = data.origin
        setMeatInfo(newInfo)
        setClose()
    }

    const onError = (error: any) => {
        console.log("ERROR:::", error)
    }

    // const currentOrigin = watch("origin")
    // useEffect(() => {
    //     setFocus("grade")
    // }, [currentOrigin])
    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className='mb-3'>
                <FloatingLabel label='무게'>
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
                    <option
                        key={5}
                        value={5}
                    >
                        {5}
                    </option>
                    <option
                        key={4}
                        value={4}
                    >
                        {4}
                    </option>
                    <option
                        key={3}
                        value={3}
                    >
                        {3}
                    </option>
                    <option
                        key={2}
                        value={2}
                    >
                        {2}
                    </option>
                    <option
                        key={1}
                        value={1}
                    >
                        {1}
                    </option>
                </Form.Select>
                {errors.floor?.type === "required" &&
                    watch("floor") === undefined && (
                        <h6 style={{ color: "red" }}>※층을 입력해주세요</h6>
                    )}
                <h6 style={{ marginTop: "12px" }}>등급</h6>
                <Form.Select
                    aria-label='agingDate'
                    {...register("agingDate", {
                        required: "등급을 설정해주세요",
                    })}
                ></Form.Select>
                {errors.agingDate?.type === "required" &&
                    watch("agingDate") === "" && (
                        <h6 style={{ color: "red" }}>※등급을 입력해주세요</h6>
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
