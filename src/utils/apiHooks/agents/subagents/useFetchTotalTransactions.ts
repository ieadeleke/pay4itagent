import { useState } from "react";
import { useApi } from "../../index";
import { SubAgentTotalTransactionHistoryParams, SubAgentTransactionHistoryParams, SubAgentTransactionHistoryResponse } from "@/utils/services/agents/types";
import { AgentService } from "@/utils/services/agents";
import { AgentTransaction, Transaction } from "@/models/transactions";

export const useFetchTotalTransactions = () => {
    const [data, setData] = useState<Transaction[]>([])
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState<number | undefined>(0);

    async function fetchTransactions(params: SubAgentTotalTransactionHistoryParams) {
        setData([]);
        const response = await execute(async () => await AgentService().getSubAgentTotalTransactionHistory(params));
        if (response) {
            setData(response?.Transaction);
            setCount(response?.count);
        }
    }

    return { isLoading, error, data, fetchTransactions, count }
}