import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, GetAllLoanHistoryParams, UpdateLoanRequestParams } from "@/utils/services/agents/types"

export const useRepayHalfLoanRequests = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function repayHalfLoanRequest(param: UpdateLoanRequestParams) {
        setData(null)
        const response = await execute(async () => await AgentService().repayHalfLoanRequest(param));
        if (response) {
            setData({
                fetched: true,
                loanRequests: response.LoanRequest
            });
        }
    }

    return { isLoading, error, data, repayHalfLoanRequest }
}