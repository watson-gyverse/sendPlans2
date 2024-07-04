import _ from "lodash"
import {useMemo, useState} from "react"
import {useNavigate} from "react-router-dom"
import styled from "styled-components"
import {GetRecentPyverse} from "../../apis/pyverseApi"
import {pyBeefCuts, pyPorkCuts, pyStores} from "../../utils/consts/meat"
import {PyverseData} from "../../utils/types/otherTypes"
import {PyverseTable} from "./pyTable"

export const PyverseScreen = () => {
	const navigate = useNavigate()
	const [tableData, setTableData] = useState<PyverseData[]>([])
	const [species, setSpecies] = useState<boolean | null>(null) //true:소
	const [isCutOpen, setCutOpen] = useState(false)
	const cutList = useMemo(() => {
		if (species === null) return []
		return species ? pyBeefCuts : pyPorkCuts
	}, [species])
	const [isGradeOpen, setGradeOpen] = useState(false)
	const gradeList = useMemo(() => {
		if (species === true) {
			return ["1++", "1+", "1", "2", "3", "수입"]
		} else return []
	}, [species])
	const [store, setStore] = useState("") //공백:전체
	const [cut, setCut] = useState("")
	const [grade, setGrade] = useState("")
	const [isStoreOpen, setStoreOpen] = useState(false)
	const [limit, setLimit] = useState(40)

	const [firstIds, setFirstIds] = useState<number[]>([])

	const [lastId, setId] = useState(0)

	// useEffect(() => {
	// 	// console.log(tableData)
	// }, [tableData])

	const naviToHome = () => {
		navigate("../")
	}
	const onPyClick = _.debounce(async (id: number) => {
		const pydata = await GetRecentPyverse(
			cut,
			grade.replace("+", "%2B"),
			store,
			id,
			limit,
		)
		if (pydata) {
			// console.log(pydata)
			if (pydata.length === limit + 1) {
				//다음페이지가 있음
				setTableData(pydata.slice(0, -1))
				setId(pydata[pydata.length - 1].id)
			} else {
				setTableData(pydata)
			}
		}
	}, 1000)

	const onSpeciesClick = () => {
		if (species === null) setSpecies(true)
		else setSpecies(!species)
		setCutOpen(false)
		setGradeOpen(false)
		setCut("")
		setGrade("")
	}

	const onCutListClick = (cut: string) => {
		if (cut === "전체") {
			setCut("")
		} else {
			setCut(cut)
		}
		closeLists()
	}

	const onGradeListClick = (grade: string) => {
		if (grade === "전체") {
			setGrade("")
		} else {
			setGrade(grade)
		}
		closeLists()
	}

	const onStoreListClick = (store: string) => {
		if (store === "전체") {
			setStore("")
		} else {
			setStore(store)
		}
		closeLists()
	}
	const closeLists = () => {
		setCutOpen(false)
		setGradeOpen(false)
		setStoreOpen(false)
	}

	const onNextButtonClick = () => {
		const newArray = JSON.parse(JSON.stringify(firstIds))
		newArray.push(tableData[0].id)
		setFirstIds(newArray)
		onPyClick(lastId)
	}

	const onBeforeButtonClick = () => {
		const beforeId = firstIds.pop()
		if (beforeId) {
			const newArray = JSON.parse(JSON.stringify(firstIds))
			setFirstIds(newArray)
			onPyClick(beforeId)
		}
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "10px 40px",
				width: "100%",
			}}>
			<MenuButton onClick={naviToHome}>뒤로</MenuButton>
			<span>{lastId}</span>
			<span>{limit}</span>
			<div>
				{firstIds.map((id) => (
					<span>{id}</span>
				))}
			</div>

			<div style={{display: "flex", flexDirection: "row"}}>
				<MenuButton onClick={() => onSpeciesClick()}>
					{species === null ? "육종" : species ? "소" : "돼지"}
				</MenuButton>
				<div>
					<MenuButton
						onClick={() => {
							// closeLists()
							setCutOpen(!isCutOpen)
						}}>
						{cut !== "" ? cut : "부위"}
					</MenuButton>
					{isCutOpen && (
						<MenuUl>
							{species !== null && (
								<MenuLi onClick={() => onCutListClick("")}>전체</MenuLi>
							)}
							{cutList.map((c) => (
								<MenuLi key={c} value={c} onClick={() => onCutListClick(c)}>
									{c}
								</MenuLi>
							))}
						</MenuUl>
					)}
				</div>
				<div>
					<MenuButton
						disabled={species === false}
						onClick={() => {
							// closeLists()
							setGradeOpen(!isGradeOpen)
						}}>
						{grade !== "" ? grade : "등급"}
					</MenuButton>
					{isGradeOpen && gradeList.length > 1 && (
						<MenuUl style={{listStyleType: "none", position: "fixed"}}>
							{species !== null && (
								<MenuLi onClick={() => onGradeListClick("")}>전체</MenuLi>
							)}
							{gradeList.map((g) => (
								<MenuLi key={g} value={g} onClick={() => onGradeListClick(g)}>
									{g}
								</MenuLi>
							))}
						</MenuUl>
					)}
				</div>
				<div>
					<MenuButton
						onClick={() => {
							// closeLists()
							setStoreOpen(!isStoreOpen)
						}}>
						{store !== "" ? store : "쇼핑몰"}
					</MenuButton>
					{isStoreOpen && (
						<MenuUl>
							<MenuLi value={""} onClick={() => onStoreListClick("")}>
								전체
							</MenuLi>
							{pyStores.map((s) => (
								<MenuLi key={s} value={s} onClick={() => onStoreListClick(s)}>
									{s}
								</MenuLi>
							))}
						</MenuUl>
					)}
					<MenuButton onClick={() => onPyClick(0)}>조회</MenuButton>
				</div>
			</div>
			<div>
				<button
					disabled={firstIds.length < 1}
					onClick={() => onBeforeButtonClick()}>
					◁
				</button>
				<button onClick={() => onNextButtonClick()}>▷</button>
			</div>
			{tableData.length > 1 && <PyverseTable tableData={tableData} />}
		</div>
	)
}

const MenuButton = styled.button`
	width: 120px;
	height: 50px;
	margin: 10px;
	background-color: #ffffff;
	border: 3px solid #57dfe6;
	border-radius: 12px;
	font-size: 1.2rem;
`

const MenuUl = styled.ul`
	position: fixed;
	list-style-type: none;
	padding: 0;
`

const MenuLi = styled.li`
	background-color: #ffffff;
	color: #000000;
	width: 100px;
	font-size: 1.2rem;
	z-index: 10;
	padding-bottom: 0.2rem;
	border-right: 2px solid #c0c0c0;
	border-bottom: 2px solid #c0c0c0;
	display: flex;
	justify-content: center;

	&:hover {
		color: #f6ff72;
		background-color: cornflowerblue;
	}
`
