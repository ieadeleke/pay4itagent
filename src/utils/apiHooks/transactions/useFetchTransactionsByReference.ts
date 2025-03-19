import { useState } from "react"
import { useApi } from "../index"
import { GetTransactionByReferenceParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"
import { Transaction } from "@/models/transactions"

export const useFetchTransactionsByReference = () => {
    const [data, setData] = useState<Transaction[]>([])
    const { isLoading, error, execute } = useApi()

    async function fetchTransactionsByReference(params: GetTransactionByReferenceParams) {
        setData([])
        const response = await execute(async () => await TransactionService().getTransactionsByReference(params))
        if (response) {
            setData(response.Transactions)
        }
    }

    return { isLoading, error, data, fetchTransactionsByReference }
}