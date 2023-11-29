import { FloatingLabel } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import {
    BeefOriginAndGrades,
    PorkOriginAndGrades,
} from "../../utils/consts/meat"
import { useEffect } from "react"
import { MeatInfoWithCount } from "../../utils/types/meatTypes"

type FormOptions = {
    price: number
    gender: string
    freeze: string
    grade: string
    origin: string
}

type ModalParams = {
    meatInfo: MeatInfoWithCount
    setMeatInfo: (mInfo: MeatInfoWithCount) => void
    setClose: () => void
}

function EditModal(props: ModalParams) {
    const { meatInfo, setMeatInfo, setClose } = props
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setFocus,
    } = useForm<FormOptions>({
        mode: "onSubmit",
        defaultValues: {
            price: undefined,
            gender: "",
            freeze: "",
            grade: "",
            origin: "",
        },
    })
    const onSubmit = (data: FormOptions) => {
        console.log("data submitted")
        console.log(data)
        const newInfo = {
            ...meatInfo,
            price: data.price.toString(),
            freeze: data.freeze,
            gender: data.gender,
            grade: data.grade,
            origin: data.origin,
        }
        setMeatInfo(newInfo)
        setClose()
    }

    const onError = (error: any) => {
        console.log("ERROR:::", error)
    }

    const currentOrigin = watch("origin")
    useEffect(() => {
        setFocus("grade")
    }, [currentOrigin])
    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.Group className='mb-3'>
                <FloatingLabel label='단가(원)'>
                    <Form.Control
                        type='number'
                        placeholder='Price'
                        {...register("price", {
                            required: `단가를 입력해주세요 ${watch("origin")}`,
                        })}
                    />
                    {errors.price?.type === "required" && (
                        <h6 style={{ color: "red" }}>※단가를 입력해주세요</h6>
                    )}
                </FloatingLabel>
            </Form.Group>
            <Form.Group>
                <h6>원산지</h6>
                <Form.Select
                    aria-label='origin'
                    {...register("origin", { required: true })}
                >
                    {meatInfo.species === "소"
                        ? Array.from(BeefOriginAndGrades.entries()).map(
                              (entry) => {
                                  return (
                                      <option
                                          key={entry[0]}
                                          value={entry[0]}
                                      >
                                          {entry[0]}
                                      </option>
                                  )
                              }
                          )
                        : Array.from(PorkOriginAndGrades.entries()).map(
                              (entry) => {
                                  return (
                                      <option
                                          key={entry[0]}
                                          value={entry[0]}
                                      >
                                          {entry[0]}
                                      </option>
                                  )
                              }
                          )}
                </Form.Select>
                {errors.origin?.type === "required" &&
                    watch("origin") === "" && (
                        <h6 style={{ color: "red" }}>※원산지를 입력해주세요</h6>
                    )}
                <h6 style={{ marginTop: "12px" }}>등급</h6>
                <Form.Select
                    aria-label='grade'
                    {...register("grade", {
                        required: "등급을 설정해주세요",
                    })}
                >
                    {meatInfo.species === "소"
                        ? BeefOriginAndGrades.get(currentOrigin)?.map(
                              (grade) => {
                                  return (
                                      <option
                                          key={grade}
                                          value={grade}
                                      >
                                          {grade}
                                      </option>
                                  )
                              }
                          )
                        : PorkOriginAndGrades.get(currentOrigin)?.map(
                              (grade) => {
                                  return (
                                      <option
                                          key={grade}
                                          value={grade}
                                      >
                                          {grade}
                                      </option>
                                  )
                              }
                          )}
                </Form.Select>
                {errors.grade?.type === "required" && watch("grade") === "" && (
                    <h6 style={{ color: "red" }}>※등급을 입력해주세요</h6>
                )}
            </Form.Group>
            <Form.Group>
                <Form.Label
                    style={{
                        width: "5rem",
                        marginTop: "10px",
                        marginRight: "12px",
                    }}
                >
                    성별:
                </Form.Label>
                <Form.Check
                    inline
                    type='radio'
                    label='암'
                    {...register("gender", {
                        required: "성별을 입력해주세요",
                    })}
                    value='암'
                    name='gender'
                    id='genderF'
                />
                <Form.Check
                    inline
                    type='radio'
                    label='수'
                    {...register("gender", {
                        required: "성별을 입력해주세요",
                    })}
                    value='수'
                    name='gender'
                    id='genderM'
                />
                <Form.Check
                    inline
                    type='radio'
                    label='암수불명'
                    {...register("gender", {
                        required: "성별을 입력해주세요",
                    })}
                    value='암수불명'
                    name='gender'
                    id='genderX'
                />
                {errors.gender?.type === "required" &&
                    watch("gender") === "" && (
                        <h6 style={{ color: "red" }}>※성별을 입력해주세요</h6>
                    )}
            </Form.Group>
            <Form.Group>
                <Form.Label
                    style={{
                        width: "5rem",
                        marginTop: "10px",
                        marginRight: "12px",
                    }}
                >
                    냉장/냉동:
                </Form.Label>
                <Form.Check
                    inline
                    type='radio'
                    label='냉장'
                    {...register("freeze", {
                        required: "보관방식을 입력해주세요",
                    })}
                    value={"냉장"}
                    name='freeze'
                    id='freezeRadioI'
                />

                <Form.Check
                    inline
                    type='radio'
                    value={"냉동"}
                    label='냉동'
                    {...register("freeze", {
                        required: "보관방식을 입력해주세요",
                    })}
                    name='freeze'
                    id='fridgeRadioE'
                />
                {errors.freeze?.type === "required" &&
                    watch("freeze") === "" && (
                        <h6 style={{ color: "red" }}>
                            ※보관방식을 입력해주세요
                        </h6>
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

export default EditModal
