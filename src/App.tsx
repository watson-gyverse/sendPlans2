import { useState } from "react"
import "./App.css"
import PresetScreen from "./screens/storage-section/presetScreen"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import MainScreen from "./screens/mainScreen"
import Layout from "./screens/initScreen"
import ErrorScreen from "./screens/errorScreen"
import CameraScreen from "./screens/storage-section/cameraScreen"
import { Container } from "react-bootstrap"
import {
    CurrentMeatLineContext,
    TotalMeatLineContext,
} from "./contexts/meatLineContext"
import { MeatInfo } from "./utils/types/meatTypes"
import EditScreen from "./screens/storage-section/editScreen"
import { StorageMiddleWare } from "./utils/toLobbyMiddleware"
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorScreen />,
    },
    {
        path: "main",
        element: <MainScreen />,
    },
    {
        path: "submit",
        element: (
            <div>
                <Outlet />
            </div>
        ),
        children: [
            {
                index: true,
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
    return (
        <TotalMeatLineContext.Provider
            value={{ totalContext, setTotalContext }}
        >
            <CurrentMeatLineContext.Provider
                value={{ currentContext, setCurrentContext }}
            >
                <Container
                    style={{
                        width: "380px",
                        height: "auto",
                        backgroundColor: "whitesmoke",
                    }}
                >
                    <RouterProvider router={router} />
                </Container>
            </CurrentMeatLineContext.Provider>
        </TotalMeatLineContext.Provider>
    )
}

export default App
