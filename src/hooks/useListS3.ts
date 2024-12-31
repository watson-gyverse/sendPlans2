import {useQuery} from "@tanstack/react-query"
import {useCallback, useEffect, useState} from "react"

interface ApiResponse {
	folders: string[]
	files: {
		fileName: string
		url: string
		lastModified: number
	}[]
}
interface IS3Gallery {
	folders: string[]
	files: {
		fileName: string
		url: string
		tUrl: string
		lastModified: number
	}[]
}
export interface TreeNode {
	name: string
	isFolder: boolean
	children?: TreeNode[]
	url?: string
}

const fetchS3 = async (path: string): Promise<IS3Gallery> => {
	const url = `https://j6hpipafc8.execute-api.ap-northeast-2.amazonaws.com/default/sp2GalleryFetch/list?prefix=${path}`
	console.log("url", url)
	const response = await fetch(url)
	const data = (await response.json()) as ApiResponse
	return {
		folders: data.folders,
		files: data.files.map((file) => {
			return {
				...file,
				tUrl: file.url.replace("images.", "images.thumbnail."),
			}
		}),
	}
}
export const useListS3 = (path: string) => {
	const {data, isLoading} = useQuery<IS3Gallery>({
		queryKey: [path],
		queryFn: async () => await fetchS3(path),
		staleTime: 1000 * 60 * 5,
	})

	return {isLoading, data}
}
