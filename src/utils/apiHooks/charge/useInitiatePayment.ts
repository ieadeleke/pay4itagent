import { useState } from "react"
import { useApi } from "../index"
import { ChargeService } from "@/utils/services/charge"
import { Payment } from "@/models/payment"
import { InitiatePaymentParams } from "@/utils/services/charge/types"

export const useInitiatePayment = () => {
    const [data, setData] = useState<Payment | null>(null)
    const { isLoading, error, execute } = useApi()

    async function initiatePayment(params: InitiatePaymentParams) {
        setData(null)
        const response = await execute(async () => await ChargeService().initiatePayment(params))
        if (response) {
            setData(response.Transaction)
        }
    }

    return { isLoading, error, data, initiatePayment }
}