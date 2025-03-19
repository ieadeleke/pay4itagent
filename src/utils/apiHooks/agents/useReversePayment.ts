import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, ReprocessPaymentParams, ReprocessPaymentResponse, ReversePaymentResponse } from "@/utils/services/agents/types"

export const useReversePayment = () => {
    const [data, setData] = useState<ReversePaymentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function reReversePayment(param: ReprocessPaymentParams) {
        setData(null)
        const response = await execute(async () => await AgentService().ReverseAgentPayment(param));
        if (response) {
            setData(response);
        }
    }

    return { isLoading, error, data, reReversePayment }
}