import { Html5QrcodeCameraScanConfig, Html5QrcodeScanner } from "html5-qrcode"
import {
    QrDimensionFunction,
    QrDimensions,
    QrcodeErrorCallback,
    QrcodeSuccessCallback,
} from "html5-qrcode/esm/core"
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner"
import { useEffect, useRef, useState } from "react"

const qrcodeRegionId = "html5qr-code-full-region"
type scanProps = Html5QrcodeScannerConfig & {
    qrCodeSuccessCallback: QrcodeSuccessCallback
    verbose?: boolean
    qrCodeErrorCallback?: QrcodeErrorCallback
}

const createConfig = (props: Html5QrcodeScannerConfig) => {
    let config: Html5QrcodeScannerConfig = { fps: undefined }
    if (props.fps) {
        config.fps = props.fps
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip
    }
    if (props.showTorchButtonIfSupported !== undefined) {
        config.showTorchButtonIfSupported = props.showTorchButtonIfSupported
    }
    return config
}

const Html5QrcodePlugin = (props: scanProps) => {
    const scanRef = useRef<Html5QrcodeScanner | null>(null)

    useEffect(() => {
        const config = createConfig(props)
        const verbose = props.verbose === true

        if (!props.qrCodeSuccessCallback) {
            throw "qrCodeSuccessCallback is required callback."
        }
        // when component mounts
        if (scanRef.current === null) {
            scanRef.current = new Html5QrcodeScanner(
                qrcodeRegionId,
                config,
                verbose
            )
        }

        const html5QrcodeScanner = scanRef.current
        html5QrcodeScanner.render(
            props.qrCodeSuccessCallback,
            props.qrCodeErrorCallback
        )
        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch((error) => {
                console.error("Failed to clear html5QrcodeScanner. ", error)
            })
        }
    }, [])

    return (
        <div
            id={qrcodeRegionId}
            style={{ width: "100%" }}
        />
    )
}

export default Html5QrcodePlugin
