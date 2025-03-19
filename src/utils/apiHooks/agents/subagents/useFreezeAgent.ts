import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents"
import { FreezeAgentParam, FreezeAgentResponse } from "@/utils/services/agents/types"

export const useFreezeAgent = () => {
    const [data, setData] = useState<FreezeAgentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function freezeAgent(params: FreezeAgentParam) {
        setData(null)
        const response = await execute(async () => await AgentService().FreezeAgent(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, freezeAgent }
}