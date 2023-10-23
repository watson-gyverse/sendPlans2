import { FloatingLabel } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { useForm } from "react-hook-form"
import { BeefOriginAndGrades, PorkOriginAndGrades } from "../utils/consts/meat"
import { useEffect } from "react"

type FormOptions = {
    price: number
    gender: string
    freeze: string
    grade: string
    origin: string
}

type ModalParams = {
    species: string
    setPrice: (price: number) => void
    setOrigin: (origin: string) => void
    setGrade: (grade: string) => void
    setGender: (gender: string) => void
    setFreeze: (freeze: string) => void
}

function EditModal(props: ModalParams) {
    const { species, setPrice, setOrigin, setGender, setGrade, setFreeze } =
        props
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
    const onSubmit = (values: any) => {
        console.log(values)
    }

    const onError = (error: any) => {
        console.log("ERROR:::", error)
    }

    const currentOrigin = watch("origin")
    useEffect(() => {
        console.log(currentOrigin)
        console.log(BeefOriginAndGrades.get(currentOrigin))
    }, [currentOrigin])
    const currentGrade = watch("grade")
    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            {/* <Form.Group className='mb-3'>
                <FloatingLabel
                    label='무게'
                    className='mb-3'
                >
                    <Form.Control
                        type='number'
                        placeholder='Weight'
                        {...register("weight", {
                            required: "무게를 입력해주세요",
                        })}
                    />
                </FloatingLabel>
            </Form.Group> */}

            <Form.Group className='mb-3'>
                <FloatingLabel label='단가(원)'>
                    <Form.Control
                        type='number'
                        placeholder='Price'
                        {...register("price", {
                            required: "단가를 입력해주세요",
                        })}
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group>
                <h6>원산지</h6>
                <Form.Select
                    aria-label='Default select example'
                    {...register("origin")}
                >
                    {species === "소"
                        ? Array.from(BeefOriginAndGrades.entries()).map(
                              (entry) => {
                                  return (
                                      <option value={entry[0]}>
                                          {entry[0]}
                                      </option>
                                  )
                              }
                          )
                        : Array.from(PorkOriginAndGrades.entries()).map(
                              (entry) => {
                                  return (
                                      <option value={entry[0]}>
                                          {entry[0]}
                                      </option>
                                  )
                              }
                          )}
                </Form.Select>

                <h6 style={{ marginTop: "12px" }}>등급</h6>
                <Form.Select
                    aria-label='Default select example'
                    {...register("grade", {
                        required: "등급을 설정해주세요",
                    })}
                >
                    {species === "소"
                        ? BeefOriginAndGrades.get(currentOrigin)?.map(
                              (grade) => {
                                  return <option value={grade}>{grade}</option>
                              }
                          )
                        : PorkOriginAndGrades.get(currentOrigin)?.map(
                              (grade) => {
                                  return <option value={grade}>{grade}</option>
                              }
                          )}
                </Form.Select>
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
                    label='알수없음'
                    {...register("gender", {
                        required: "성별을 입력해주세요",
                    })}
                    value='알수없음'
                    name='gender'
                    id='genderX'
                />
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
