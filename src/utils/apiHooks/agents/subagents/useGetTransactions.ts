import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents";
import { TransactionHistoryParams, TransactionHistoryResponse } from "@/utils/services/agents/types";

export const useFundWallet = () => {
    const [data, setData] = useState<TransactionHistoryResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function fundWallet(params: TransactionHistoryParams) {
        setData(null)
        const response = await execute(async () => await AgentService().FetchTransactionHistory(params))
        if (response) {
            console.log(response);
            setData(response);
        }
    }
    
    return { isLoading, error, data, fundWallet }
}