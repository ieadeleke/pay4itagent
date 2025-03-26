import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse } from "@/utils/services/agents/types"

export const useGetAgentsTransactionHistory = () => {
    const [data, setData] = useState<GetAllAgentsTransactionHistoryResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function getAgentTransactionHistory(param: GetAllAgentsTransactionHistoryParams) {
        setData(null)
        const response = await execute(async () => await AgentService().getAllAgentsTransactionHistory(param));
        if (response) {
            console.log(response?.Transaction)
            console.log(response?.transactions)
            setData({
                ...response,
                Transaction: response?.transactions
            });
        }
    }

    return { isLoading, error, data, getAgentTransactionHistory }
}