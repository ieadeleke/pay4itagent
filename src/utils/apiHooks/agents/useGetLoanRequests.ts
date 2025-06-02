import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, GetAllLoanHistoryParams } from "@/utils/services/agents/types"

export const useGetLoanRequests = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function getAllRequests(param: GetAllLoanHistoryParams) {
        setData(null)
        const response = await execute(async () => await AgentService().getAllLoanRequests(param));
        if (response) {
            setData({
                fetched: true,
                loanRequests: response.loanRequests
            });
        }
    }

    return { isLoading, error, data, getAllRequests }
}