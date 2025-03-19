import { useState } from "react"
import { useApi } from "../index"
import { GetTransactionByPaymentRefParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"
import { Transaction } from "@/models/transactions"

export const useFetchTranscationByPaymentRef = () => {
    const [data, setData] = useState<Transaction | null>(null)
    const { isLoading, error, execute } = useApi()

    async function fetchTransactionByPaymentRef(params: GetTransactionByPaymentRefParams) {
        setData(null)
        const response = await execute(async () => await TransactionService().getTransactionByPaymentRef(params))
        if (response) {
            setData(response.Transaction)
        }
    }

    return { isLoading, error, data, fetchTransactionByPaymentRef }
}