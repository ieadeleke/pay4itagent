import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, GetAllLoanHistoryParams, UpdateLoanRequestParams } from "@/utils/services/agents/types"

export const useRepayLoanRequests = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function repayLoanRequest(param: UpdateLoanRequestParams) {
        setData(null)
        const response = await execute(async () => await AgentService().repayLoanRequest(param));
        if (response) {
            setData({
                fetched: true,
                loanRequests: response.LoanRequest
            });
        }
    }

    return { isLoading, error, data, repayLoanRequest }
}