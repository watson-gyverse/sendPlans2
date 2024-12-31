import {useEffect, useState} from "react"
import {TreeNode, useListS3} from "../../hooks/useListS3"
import {GridGallery, IGridGallery} from "./grid"
import {D} from "@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o"

export const GalleryScreen = () => {
	const [clientInput, setClientInput] = useState<string>("")
	const [client, setClient] = useState<string>("")
	const {isLoading, data} = useListS3(client)
	// const [gProps, setGProps] = useState<IGridGallery[]>([])

	useEffect(() => {
		console.log("data:", data)
	}, [data])
	useEffect(() => {
		console.log("client: ", client)
	}, [client])
	const onNameInputClick = () => {
		setClient(clientInput)
	}
	if (!client) {
		return (
			<div>
				<p>사용자 코드를 입력해주세요.</p>
				<input onChange={(e) => setClientInput(e.target.value)} />
				<button onClick={onNameInputClick}>입력</button>
			</div>
		)
	}
	if (!data) {
		return <div>로딩중입니다</div>
	}

	// console.log("s3List", s3List)

	const onBackStackClick = () => {
		const slashRemoved = removeLastSegment(client)
		setClient(slashRemoved)
	}

	const onFolderClick = (folder: string) => {
		setClient(client + "/" + folder)
	}

	return (
		<div>
			<button onClick={() => setClient("")}>사용자 코드 다시 입력</button>

			<p>현재 위치 {client}</p>
			{client.split("/").length > 1 && (
				<div onClick={onBackStackClick}>📁 ...</div>
			)}
			{data &&
				data.folders &&
				data.folders.map((folder) => (
					<div onClick={() => onFolderClick(folder)}>📁 {folder}</div>
				))}
			{data && data.files && (
				<GridGallery
					galleryProps={data.files.map((file) => {
						const url = file.url
						const tUrl = file.tUrl
						const timestamp = file.lastModified
						const gProp = {url, tUrl, timestamp}
						return gProp
					})}
				/>
			)}
		</div>
	)
}

const TreeView = ({node}: {node: TreeNode}) => {
	if (!node.isFolder) {
		return <div style={{marginLeft: "1rem"}}>📄 {node.name}</div>
	}
	return (
		<div style={{marginLeft: "1rem"}}>
			<div>📁 {node.name}</div>
			{node.children?.map((child) => (
				<TreeView key={child.name} node={child} />
			))}
		</div>
	)
}
function removeLastSegment(input: string): string {
	const lastSlashIndex = input.lastIndexOf("/")
	if (lastSlashIndex === -1) {
		// '/'가 없으면 원래 문자열 그대로 반환
		return input
	}
	// 마지막 '/' 이전까지 잘라서 반환
	return input.slice(0, lastSlashIndex)
}
