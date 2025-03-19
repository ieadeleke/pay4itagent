import { useState } from "react"
import { useApi } from "../index"
import { GetTransactionsParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"
import { Transaction } from "@/models/transactions"

export const useFetchTranscations = () => {
    const [data, setData] = useState<Transaction[]>([])
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState(0)

    async function fetchTransactions(params: GetTransactionsParams) {
        setData([]);
        const response = await execute(async () => await TransactionService().getSubAgentTransactions(params));
        if (response) {
            setData(response.Transaction);
            setCount(response.count);
        }
    }

    return { isLoading, error, data, fetchTransactions, count }
}