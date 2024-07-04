import styled from "styled-components"
import {PyverseData} from "../../utils/types/otherTypes"

interface IPyverseTable {
	tableData: PyverseData[]
}

export const PyverseTable = (props: IPyverseTable) => {
	const {tableData} = props

	return (
		<table>
			<tr key={"tr"}>
				{tableData &&
					Object.keys(tableData[0]).map((datum) => {
						return <th key={datum}>{datum}</th>
					})}
			</tr>
			<tbody>
				{tableData.map((datum) => {
					return (
						<tr>
							<Ptd>{datum.id}</Ptd>
							<Ptd>{datum.timestamp}</Ptd>
							<Ptd>{datum.store}</Ptd>
							<Ptd>{datum.species}</Ptd>
							<Ptd>{datum.cut}</Ptd>
							<Ptd>{datum.grade}</Ptd>
							<Ptd>{datum.name}</Ptd>
							<Ptd>{datum.freeze}</Ptd>
							<Ptd>{datum.total_price}</Ptd>
							<Ptd>{datum.price}</Ptd>
							<Ptd>{datum.weight}</Ptd>
							<Ptd>{datum.min_weight}</Ptd>
							<Ptd>{datum.max_weight}</Ptd>
							<Ptd>{datum.avg_weight}</Ptd>
							<Ptd>{datum.date}</Ptd>
							<Ptd>{datum.exp_date}</Ptd>
							<Ptd>{datum.stock}</Ptd>
							<Ptd>{datum.origin}</Ptd>
							<Ptd>{datum.brand}</Ptd>
							<Ptd>{datum.fat_back}</Ptd>
							<Ptd>{datum.fat_section}</Ptd>
							<Ptd>{datum.inner_fat}</Ptd>
							<Ptd>{datum.url}</Ptd>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

const Ptd = styled.td`
	border-bottom: 1px solid #e2e2e2;
	border-right: 1px solid #e2e2e2;
`
