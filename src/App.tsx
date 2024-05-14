import {useState} from "react"
import "./App.css"
import PresetScreen from "./screens/storage-section/presetScreen"
import {Outlet, RouterProvider, createBrowserRouter} from "react-router-dom"
import MainScreen from "./screens/mainScreen"
import ErrorScreen from "./screens/errorScreen"
import CameraScreen from "./screens/storage-section/cameraScreen"
import {Container} from "react-bootstrap"
import {StorageContext} from "./contexts/meatLineContext"
import {StorageMiddleWare} from "./utils/toLobbyMiddleware"
import PlaceScreen from "./screens/aging-section/placeScreen"
import {backgroundColors} from "./utils/consts/colors"
import EditScreen from "./screens/storage-section/editScreen"
import {FetchScreen2} from "./screens/aging-section/fetchScreen2"
import ReportScreen from "./screens/report-section/reportScreen"
import {ConsignScreen} from "./screens/consign-section/consignScreen"
import RecordBranchScreen from "./screens/record-section/recordScreen"
import {StockScreen} from "./screens/stock-section/stockScreen"
import {OrderHistoryScreen} from "./screens/stock-section/orderHistoryScreen"

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Outlet />,
			errorElement: <ErrorScreen />,
			children: [
				{
					index: true,
					// path: "main",
					element: <MainScreen />,
				},
				{
					path: "storage",
					element: (
						<div>
							<Outlet />
						</div>
					),
					children: [
						{
							index: true,
							element: <PresetScreen />,
						},
						{
							path: "camera",
							element: (
								<StorageMiddleWare>
									<CameraScreen />
								</StorageMiddleWare>
							),
						},
						{
							path: "edit",
							element: (
								<StorageMiddleWare>
									<EditScreen />
								</StorageMiddleWare>
							),
						},
					],
				},
				{
					path: "aging",
					element: (
						<div>
							<Outlet />
						</div>
					),
					children: [
						{index: true, element: <PlaceScreen />},
						{
							path: "fetch/",
							element: <FetchScreen2 />,
						},
					],
				},
				{
					path: "record",
					element: <RecordBranchScreen />,
				},
				{
					path: "report",
					element: <ReportScreen />,
				},
				{
					path: "consign",
					element: <ConsignScreen />,
				},
				{
					path: "stock",
					element: (
						<div>
							<Outlet />
						</div>
					),
					children: [
						{index: true, element: <StockScreen />},
						{path: "orders", element: <OrderHistoryScreen />},
					],
				},
				{
					path: "*",
					element: <>Not Found 051</>,
				},
			],
		},
	],
	{basename: process.env.PUBLIC_URL},
)

function App() {
	// const [isLoading, setLoading] = useState(true)
	// const init = async () => {
	// 	await new Promise((resolve) => setTimeout(resolve, 2000))
	// 	setLoading(false)
	// }
	// init()

	const [scanText, setScanText] = useState<string>("undefined")
	return (
		<StorageContext.Provider
			value={{
				scanText,
				setScanText,
			}}>
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "flex-start",
					backgroundColor: backgroundColors.base,
				}}>
				<RouterProvider
					router={router}
					// fallbackElement={<div>로딩</div>}
				/>
			</div>
		</StorageContext.Provider>
	)
}

export default App
