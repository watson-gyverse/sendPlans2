import { useState } from "react"
import "./App.css"
import PresetScreen from "./screens/storage-section/presetScreen"
import {
    Outlet,
    RouterProvider,
    createBrowserRouter,
    useNavigate,
} from "react-router-dom"
import MainScreen from "./screens/mainScreen"
import Layout from "./screens/initScreen"
import ErrorScreen from "./screens/errorScreen"
import CameraScreen from "./screens/storage-section/cameraScreen"
import { Container } from "react-bootstrap"
import {
    CurrentMeatLineContext,
    CurrentScanTextContext,
    TotalMeatLineContext,
} from "./contexts/meatLineContext"
import { MeatInfo } from "./utils/types/meatTypes"
import EditScreen from "./screens/storage-section/editScreen"
import { StorageMiddleWare } from "./utils/toLobbyMiddleware"
import PlaceScreen from "./screens/aging-section/placeScreen"
import { FetchScreen } from "./screens/aging-section/fetchScreen"

const router = createBrowserRouter([
    {
        path: "/",
        // loader: async () => {
        //     return new Promise((res) => {
        //         setTimeout(() => {
        //             return res("finish!")
        //         }, 3000)
        //     })
        // },
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
                        path: "preset",

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
                            // <StorageMiddleWare>
                            <EditScreen />
                            // </StorageMiddleWare>
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
        ],
    },
])

function App() {
    const [isLoading, setLoading] = useState(true)
    const init = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setLoading(false)
    }
    init()
    const [currentContext, setCurrentContext] = useState<MeatInfo | null>(null)
    const [totalContext, setTotalContext] = useState(new Map())
    const [scanText, setScanText] = useState<string>("undefined")
    return (
        <TotalMeatLineContext.Provider
            value={{ totalContext, setTotalContext }}
        >
            <CurrentMeatLineContext.Provider
                value={{ currentContext, setCurrentContext }}
            >
                <CurrentScanTextContext.Provider
                    value={{ scanText, setScanText }}
                >
                    <Container
                        style={{
                            width: "380px",
                            height: "auto",
                            backgroundColor: "whitesmoke",
                        }}
                    >
                        <RouterProvider
                            router={router}
                            // fallbackElement={<div>로딩</div>}
                        />
                    </Container>
                </CurrentScanTextContext.Provider>
            </CurrentMeatLineContext.Provider>
        </TotalMeatLineContext.Provider>
    )
}

export default App
