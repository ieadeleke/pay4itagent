import { useState } from "react"
import { useApi } from "../../index"

import { AgentTransactionHistoryByDateRangeParams, AgentTransactionHistoryByDateRangeResponse, SubAgentTransactionHistoryByDateRangeResponse, SubAgentTransactionHistoryResponse } from "@/utils/services/agents/types";
import { AgentService } from "@/utils/services/agents";
import { AgentTransaction } from "@/models/transactions";

export const useFetchTransactionByDateRange = () => {
    const [data, setData] = useState<SubAgentTransactionHistoryByDateRangeResponse | null>(null)
    const { isLoading, error, execute } = useApi()

    async function fetchTransactionsByDateRange(params: AgentTransactionHistoryByDateRangeParams) {
        setData(null)
        const response = await execute(async () => await AgentService().getSubAgentTransactionHistoryByDate(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, fetchTransactionsByDateRange }
}