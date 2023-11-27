import { useState } from "react"
import styled from "styled-components"

type ScanResult = {
    meatNumber: string
    species: string
    grade?: string
    gender?: string
}
export const ScanResultBox = (props: ScanResult) => {
    const { meatNumber, species, grade, gender } = props
    return (
        <div
            style={{
                width: "100%",
                height: "auto",
                padding: "10px 20px",
            }}
        >
            <h6>이력번호: </h6>
            <ContentText>{meatNumber ? meatNumber : "-"}</ContentText>
            <h6>분류: </h6>
            <ContentText>{species ? species : "-"}</ContentText>
            <h6>등급(단일 이력번호일 때만 표시):</h6>
            <ContentText>{grade ? grade : "-"}</ContentText>
            <h6>부가정보(단일 이력번호일 때만 표시): </h6>
            <ContentText>{gender ? gender : "-"}</ContentText>
        </div>
    )
}

const ContentText = styled.h6`
    margin-left: 10px;
    font-weight: bold;
`
