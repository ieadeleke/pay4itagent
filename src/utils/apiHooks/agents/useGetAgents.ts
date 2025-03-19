import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "@/utils/services/agents"
import { GetAllAgentsParams, GetAllAgentsResponse } from "@/utils/services/agents/types"

export const useGetAgents = () => {
    const [data, setData] = useState<GetAllAgentsResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function getAgentList(params: GetAllAgentsParams) {
        setData(null)
        const response = await execute(async () => await AgentService().getAllAgents(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, getAgentList }
}