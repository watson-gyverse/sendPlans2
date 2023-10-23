import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios"
import { baseUrl } from "./consts/urls"

export interface TokenResponse {
    RefreshToken: string
    AccessToken: string
}

const axiosInstance = axios.create({
    baseURL: baseUrl,
})

const axiosWithHeader = (): AxiosInstance => {
    const token = window.sessionStorage.getItem("aToken")

    axiosInstance.interceptors.request.use(
        (req) => {
            req.headers.accessToken = token
            return req
        },
        (error) => {
            console.error(error)
            return Promise.reject(error)
        }
    )

    return axiosInstance
}

export const getData = async <T>(
    url: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        console.log(axiosInstance.head)
        const response = await axiosWithHeader().get<T>(url, config)
        console.log(response)
        return response.data
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
        else throw error
    }
}

export const postData = async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> => {
    try {
        const response = await axiosInstance.post<T>(url, data, config)
        return response.data
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
        else throw error
    }
}
