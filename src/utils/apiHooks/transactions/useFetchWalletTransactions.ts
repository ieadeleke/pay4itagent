import { useState } from "react"
import { useApi } from "../index"
import { GetTransactionsParams, GetWalletTransactionsParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"
import { Transaction, WalletTransactionType } from "@/models/transactions"

type TransactionTabType = {
    amount: number
    balance_after: number
    balance_before: number
    category: string
    currency: string
    description: string
    reference: string
    status: string
    total: number
    type: string
    walletId: string
}

interface WalletTransactionsInterface {
    categoryEnum: any
    typeEnum: any
    Transaction: WalletTransactionType[]
    count?: any
}

export const useFetchWalletTranscations = () => {
    const [data, setData] = useState<WalletTransactionsInterface>({
        categoryEnum: {},
        typeEnum: {},
        Transaction: [],
        count: 0
    })
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState(0)

    async function fetchTransactions(params: GetWalletTransactionsParams) {
        setData({
            categoryEnum: {},
            typeEnum: {},
            Transaction: []
        });
        const response = await execute(async () => await TransactionService().getWalletTransactions(params));
        if (response) {
            setData({
                count: response?.count,
                categoryEnum: response.categoryEnum,
                typeEnum: response.typeEnum,
                Transaction: response.Transaction
            });
            setCount(response.count);
        }
    }

    return { isLoading, error, data, fetchTransactions, count }
}