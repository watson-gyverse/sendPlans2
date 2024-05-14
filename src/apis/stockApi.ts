import {
	addDoc,
	arrayRemove,
	arrayUnion,
	doc,
	getDoc,
	increment,
	updateDoc,
	writeBatch,
} from "firebase/firestore"
import {getCollection} from "../utils/consts/functions"
import {fbCollections} from "../utils/consts/constants"
import {firestoreDB} from "../utils/Firebase"
import {StockOrderItem, StockProduct} from "../utils/types/stockTypes"

const dbStock = getCollection(fbCollections.sp2Stock)
const dbOrder = getCollection(fbCollections.sp2Order)

export async function addCategory(name: string, id: number) {
	await addDoc(dbStock, {catName: name, order: id, products: []})
}

export async function addOrder(orderList: StockOrderItem[]) {
	await addDoc(dbOrder, {dateTime: new Date().getTime(), orders: orderList})
}

export async function updateProduct(
	catId: string,
	name: string,
	cnt: number,
	order: number, //순서
	color: string,
	prevName: string | null,
) {
	console.log(catId, order)
	const categoryRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${catId}`)
	const snapshot = await getDoc(categoryRef)
	const prevData = snapshot.exists()
		? prevName
			? snapshot
					.data()
					.products.filter((datum: StockProduct) => datum.prdName !== prevName)
			: snapshot.data().products
		: []
	console.log("prevData: ", prevData)

	const uniqueData = [
		...new Map(
			[
				...prevData,
				{prdOrder: order, prdName: name, prdCnt: cnt, color: color},
			].map((prd) => [prd.prdName, prd]),
		).values(),
	]
	console.log(uniqueData)

	await updateDoc(categoryRef, {
		products: uniqueData,
	})
}

export async function updateProductsAfterOrder(orderList: StockOrderItem[]) {
	const batch = writeBatch(firestoreDB)

	const promises = orderList.map(async (order) => {
		const docRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${order.catId}`)
		const snapshot = await getDoc(docRef)
		const products: StockProduct[] = snapshot.exists()
			? snapshot.data().products || []
			: []
		const target = products.find((p) => p.prdName === order.prdName)
		console.log(`${order.prdName}`)

		batch.update(docRef, {
			products: arrayRemove({
				prdOrder: target?.prdOrder,
				prdName: order.prdName,
				prdCnt: target?.prdCnt,
				color: target?.color,
			}),
		})

		if (target && target.prdCnt >= order.change) {
			console.log("다시넣음")

			batch.update(docRef, {
				products: arrayUnion({
					prdOrder: target?.prdOrder,
					prdName: order.prdName,
					prdCnt: target.prdCnt + order.change,
					color: target.color,
				}),
			})
		}
	})

	await Promise.all(promises)
	await batch.commit()
}

export async function deleteProduct(catId: string, pd: StockProduct) {
	const categoryRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${catId}`)
	await updateDoc(categoryRef, {
		products: arrayRemove(pd),
	})
}

export async function exchangeCategoryOrder(nCatId: string, sCatId: string) {
	const nCatRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${nCatId}`)
	const sCatRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${sCatId}`)
	const batch = writeBatch(firestoreDB)
	batch.update(nCatRef, {
		order: increment(1),
	})
	batch.update(sCatRef, {
		order: increment(-1),
	})

	await batch.commit()
}

export async function exchangeProductsOrder(
	catId: string,
	lPd: StockProduct,
	rPd: StockProduct,
) {
	const categoryRef = doc(firestoreDB, `${fbCollections.sp2Stock}/${catId}`)
	const batch = writeBatch(firestoreDB)
	const newLPd: StockProduct = {
		prdOrder: lPd.prdOrder + 1,
		prdName: lPd.prdName,
		prdCnt: lPd.prdCnt,
		color: lPd.color,
	}
	const newRPd: StockProduct = {
		prdOrder: rPd.prdOrder - 1,
		prdName: rPd.prdName,
		prdCnt: rPd.prdCnt,
		color: rPd.color,
	}
	const promises: Promise<void>[] = []
	promises.push(
		new Promise((resolve) => {
			batch.update(categoryRef, {
				products: arrayRemove(lPd),
			})
			resolve()
		}),
	)

	promises.push(
		new Promise((resolve) => {
			batch.update(categoryRef, {
				products: arrayRemove(rPd),
			})
			resolve()
		}),
	)
	promises.push(
		new Promise((resolve) => {
			batch.update(categoryRef, {
				products: arrayUnion(newLPd),
			})
			resolve()
		}),
	)
	promises.push(
		new Promise((resolve) => {
			batch.update(categoryRef, {
				products: arrayUnion(newRPd),
			})
			resolve()
		}),
	)
	await Promise.all(promises)
	await batch.commit()
}
