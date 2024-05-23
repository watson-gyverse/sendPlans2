import {addDoc, doc, getDocs, query, updateDoc, where} from "firebase/firestore"
import {fbCollections} from "../utils/consts/constants"
import {getCollection} from "../utils/consts/functions"
import {firestoreDB} from "../utils/Firebase"

export type LoginUser = {
	name: string
	email: string
	lastLogin: number //timestamp
	createdAt: number //timestamp
}
const dbUser = getCollection(fbCollections.sp2User)

export async function addUser(user: LoginUser) {
	// const now = new Date().getTime()
	const result = await addDoc(dbUser, {
		name: user.name,
		email: user.email,
		lastLogin: user.lastLogin,
		createdAt: user.createdAt,
	})
	console.log(result)

	// const uid = result.id
}

export async function updateUserLogin(email: string) {
	//doc id
	const q = query(dbUser, where("email", "==", email))
	const snapshot = await getDocs(q)

	if (snapshot.empty) {
		return
	} else {
		snapshot.forEach(async (sn) => {
			const docRef = doc(firestoreDB, `${fbCollections.sp2User}/${sn.id}`)
			const now = new Date().getTime()
			const result = await updateDoc(docRef, {
				name: sn.data().name,
				email: sn.data().email,
				lastLogin: now,
				createdAt: sn.data().createdAt,
			})
		})
	}
}
