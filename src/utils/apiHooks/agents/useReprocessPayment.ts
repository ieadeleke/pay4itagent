import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, ReprocessPaymentParams, ReprocessPaymentResponse } from "@/utils/services/agents/types"

export const useReprocessPayment = () => {
    const [data, setData] = useState<ReprocessPaymentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function reProcessPayment(param: ReprocessPaymentParams) {
        setData(null)
        const response = await execute(async () => await AgentService().ReProcessAgentPayment(param));
        if (response) {
            setData(response.payload);
        }
    }

    return { isLoading, error, data, reProcessPayment }
}