import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, GetAllLoanHistoryParams, UpdateLoanRequestParams } from "@/utils/services/agents/types"

export const useCancelLoanRequests = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function cancelLoanRequest(param: UpdateLoanRequestParams) {
        setData(null)
        const response = await execute(async () => await AgentService().cancelLoanRequest(param));
        if (response) {
            setData({
                fetched: true,
                loanRequests: response.loanRequests
            });
        }
    }

    return { isLoading, error, data, cancelLoanRequest }
}