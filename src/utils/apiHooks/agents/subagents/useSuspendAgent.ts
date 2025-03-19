import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents"
import { SuspendAgentParams, SuspendAgentResponse } from "@/utils/services/agents/types"

export const useSuspendAgents = () => {
    const [data, setData] = useState<SuspendAgentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function suspendAgent(params: SuspendAgentParams) {
        setData(null)
        const response = await execute(async () => await AgentService().SuspendAgent(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, suspendAgent }
}