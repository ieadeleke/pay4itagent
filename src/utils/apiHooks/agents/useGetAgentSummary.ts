import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsParams, GetAllAgentsResponse, GetAllAgentsSummaryResponse } from "@/utils/services/agents/types"

export const useGetAgentsSummary = () => {
    const [data, setData] = useState<GetAllAgentsSummaryResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function getAgentSummary() {
        setData(null)
        const response = await execute(async () => await AgentService().getAllAgentsSummary())
        if (response) {
            setData(response);
        }
    }

    return { isLoading, error, data, getAgentSummary }
}