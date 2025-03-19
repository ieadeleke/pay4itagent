import { useState } from "react"
import { useApi } from "../index"
import { ChargeService } from "@/utils/services/charge"
import { Payment } from "@/models/payment"
import { PaymentNotificationParams } from "@/utils/services/charge/types"
import { errorHandler } from "@/utils/errorHandler"
import { useRouter } from "next/router"

export const usePaymentNotification = () => {
    const [data, setData] = useState<(Payment & { ReceiptNumber: string }) | null>(null)
    const { isLoading, execute } = useApi()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function upperlinkNotification(params: PaymentNotificationParams) {
        setData(null)
        setError(null)
        const response = await execute(async () => await ChargeService().paymentNotification(params), {
            onError(error) {
                const parsedError = errorHandler(error)
                if (parsedError.status == 402) {
                    setError("Payment failed")
                    setTimeout(() => {
                        router.replace(`/payment/collection`)
                    }, 1000)
                } else {
                    setError(parsedError.message)
                }
            },
        })
        if (response) {
            setData({ ...response.payload, ReceiptNumber: response.ReceiptNumber })
        }
    }

    return { isLoading, error, data, upperlinkNotification }
}