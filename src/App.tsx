import {useState} from "react"
import "./App.css"
import PresetScreen from "./screens/storage-section/presetScreen"
import {Outlet, RouterProvider, createBrowserRouter} from "react-router-dom"
import MainScreen from "./screens/mainScreen"
import ErrorScreen from "./screens/errorScreen"
import CameraScreen from "./screens/storage-section/cameraScreen"
import {StorageContext} from "./contexts/meatLineContext"
import {StorageMiddleWare, TokenMiddleWare} from "./utils/toLobbyMiddleware"
import PlaceScreen from "./screens/aging-section/placeScreen"
import {backgroundColors} from "./utils/consts/colors"
import EditScreen from "./screens/storage-section/editScreen"
import {FetchScreen2} from "./screens/aging-section/fetchScreen2"
import ReportScreen from "./screens/report-section/reportScreen"
import {ConsignScreen} from "./screens/consign-section/consignScreen"
import RecordBranchScreen from "./screens/record-section/recordScreen"
import {StockScreen} from "./screens/stock-section/stockScreen"
import {OrderHistoryScreen} from "./screens/stock-section/orderHistoryScreen"
import {SampleFormScreen} from "./screens/form-section/sampleFormScreen"
import {PyverseScreen} from "./screens/pyverse-section/pyverseScreen"
import {GalleryScreen} from "./screens/gallery-section/galleryScreen"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
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
						<TokenMiddleWare>
							<Outlet />
						</TokenMiddleWare>
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
						<TokenMiddleWare>
							<Outlet />
						</TokenMiddleWare>
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
					element: (
						<TokenMiddleWare>
							<RecordBranchScreen />
						</TokenMiddleWare>
					),
				},
				{
					path: "report",
					element: (
						<TokenMiddleWare>
							<ReportScreen />
						</TokenMiddleWare>
					),
				},
				{
					path: "consign",
					element: (
						<TokenMiddleWare>
							<ConsignScreen />
						</TokenMiddleWare>
					),
				},
				{
					path: "stock",
					element: (
						<TokenMiddleWare>
							<Outlet />
						</TokenMiddleWare>
					),
					children: [
						{index: true, element: <StockScreen />},
						{path: "orders", element: <OrderHistoryScreen />},
					],
				},
				{path: "submit", element: <SampleFormScreen />},
				{path: "py", element: <PyverseScreen />},
				{path: "gallery", element: <GalleryScreen />},
				{
					path: "*",
					element: <ErrorScreen />,
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
	const queryClient = new QueryClient()
	const [scanText, setScanText] = useState<string>("undefined")
	return (
		<QueryClientProvider client={queryClient}>
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
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}

export default App
