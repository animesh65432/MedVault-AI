import { useEffect, useState } from "react"
import PdfPageImage from "react-native-pdf-page-image"

export const usePdfThumbnail = (
    pdfUri: string,
    enabled: boolean = true
) => {
    const [thumbUri, setThumbUri] = useState<string | null>(null)
    const [thumbFailed, setThumbFailed] = useState(false)

    useEffect(() => {
        if (!enabled) return

        let cancelled = false

        setThumbUri(null)
        setThumbFailed(false)

        PdfPageImage.generate(pdfUri, 0, 1.0)
            .then((image) => {
                if (!cancelled) {
                    setThumbUri(image.uri)
                }
            })
            .catch((error) => {
                console.warn("PDF thumbnail failed:", error)

                if (!cancelled) {
                    setThumbFailed(true)
                }
            })

        return () => {
            cancelled = true
        }
    }, [pdfUri, enabled])

    return {
        thumbUri,
        thumbFailed,
    }
}
