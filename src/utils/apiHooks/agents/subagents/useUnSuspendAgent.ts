import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents"
import { SuspendAgentParams, SuspendAgentResponse } from "@/utils/services/agents/types"

export const useUnSuspendAgents = () => {
    const [data, setData] = useState<SuspendAgentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function unSuspendAgent(params: SuspendAgentParams) {
        setData(null)
        const response = await execute(async () => await AgentService().UnSuspendAgent(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, unSuspendAgent }
}