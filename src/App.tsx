import { useState } from "react"
import "./App.css"
import PresetScreen from "./screens/storage-section/presetScreen"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import MainScreen from "./screens/mainScreen"
import ErrorScreen from "./screens/errorScreen"
import CameraScreen from "./screens/storage-section/cameraScreen"
import { Container } from "react-bootstrap"
import { StorageContext } from "./contexts/meatLineContext"
import { StorageMiddleWare } from "./utils/toLobbyMiddleware"
import PlaceScreen from "./screens/aging-section/placeScreen"
import { FetchScreen } from "./screens/aging-section/fetchScreen"
import RecordScreen from "./screens/record-section/recordScreen"
import { backgroundColors } from "./utils/consts/colors"
import EditScreen from "./screens/storage-section/editScreen"

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
                        { index: true, element: <PlaceScreen /> },
                        {
                            path: "fetch/",
                            element: <FetchScreen />,
                        },
                    ],
                },
                {
                    path: "record",
                    element: <RecordScreen />,
                },
                {
                    path: "*",
                    element: <>Not Found 051</>,
                },
            ],
        },
    ],
    { basename: process.env.PUBLIC_URL }
)

function App() {
    const [isLoading, setLoading] = useState(true)
    const init = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setLoading(false)
    }
    init()

    const [scanText, setScanText] = useState<string>("undefined")
    return (
        <StorageContext.Provider
            value={{
                scanText,
                setScanText,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: backgroundColors.base,
                }}
            >
                <Container
                    style={{
                        width: "380px",
                        height: "auto",
                        padding: "24px 20px 30px 20px",
                    }}
                >
                    <RouterProvider
                        router={router}
                        // fallbackElement={<div>로딩</div>}
                    />
                </Container>
            </div>
        </StorageContext.Provider>
    )
}

export default App
