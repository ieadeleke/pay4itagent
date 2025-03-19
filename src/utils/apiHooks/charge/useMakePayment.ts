import { useState } from "react"
import { useApi } from "../index"
import { ChargeService } from "@/utils/services/charge"
import { MakePaymentParams } from "@/utils/services/charge/types"
import { Payment } from "@/models/payment"

export const useMakePayment = () => {
    const [data, setData] = useState<Payment | null>(null)
    const { isLoading, error, execute } = useApi()

    async function makePayment(params: MakePaymentParams) {
        setData(null)
        const response = await execute(async () => await ChargeService().makePayment(params))
        if (response) {
            // setData(response)
        }
    }

    return { isLoading, error, data, makePayment }
}
