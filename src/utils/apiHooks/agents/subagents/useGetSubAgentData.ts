import { useState } from "react"
import { useApi } from "../../index";
import { SubAgentService } from "@/utils/services/agents/subagents"
import { GetSingleAgentParams, GetSingleAgentResponse } from "@/utils/services/agents/subagents/types"

export const useGetSubAgent = () => {
    const [data, setData] = useState<GetSingleAgentResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function getSubAgentData(params: GetSingleAgentParams) {
        setData(null)
        const response = await execute(async () => await SubAgentService().getSingleSubAgent(params));
        // console.log(response);
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, getSubAgentData }
}