import {Navigate} from "react-router-dom"

import React from "react"
import toast, {Toaster} from "react-hot-toast"
import {sessionKeys} from "./consts/constants"
import {checkValidAccount} from "./consts/functions"
export const StorageMiddleWare = (props: any) => {
	const session = sessionStorage
	let tempDate = session.getItem(sessionKeys.storageDate)
	let tempSpecies = session.getItem(sessionKeys.storageSpecies)
	let tempCut = session.getItem(sessionKeys.storageCut)
	if (!tempDate || !tempSpecies || !tempCut) {
		toast("입고일과 고기 정보를 먼저 입력해주세요")
		return (
			<>
				<Toaster />
				<Navigate to={{pathname: "/storage/preset"}} />{" "}
			</>
		)
	}
	return <React.Fragment>{props.children}</React.Fragment>
}

export const AgingMiddleWare = (props: any) => {
	const session = sessionStorage
	let tempPlace = session.getItem(sessionKeys.agingPlace)
	if (!tempPlace) {
		toast("숙성장소를 먼저 선택해주세요")
		return (
			<>
				<Toaster />
				<Navigate to={{pathname: "/aging"}} />
			</>
		)
	}
	return <React.Fragment>{props.children}</React.Fragment>
}

export const TokenMiddleWare = (props: any) => {
	if (!checkValidAccount()) {
		toast("접근 권한이 필요합니다")
		return (
			<>
				<Toaster />
				<Navigate to={{pathname: "/"}} />
			</>
		)
	}
	return <React.Fragment>{props.children}</React.Fragment>
}
