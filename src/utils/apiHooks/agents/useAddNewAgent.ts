import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "../../services/agents";
import { AddAgentParams, AddAgentResponse } from "@/utils/services/agents/types"

export const useAddAgents = () => {
    const [data, setData] = useState<AddAgentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function addnewAgent(params: AddAgentParams) {
        setData(null)
        const response = await execute(async () => await AgentService().addNewAgent(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, addnewAgent }
}