import { useState } from "react"
import { useApi } from "../../index";
import { SubAgentService } from "@/utils/services/agents/subagents"
import { GetSingleAgentParams, GetSingleAgentResponse, GetSingleAgentSummaryParams, GetSingleAgentSummaryResponse } from "@/utils/services/agents/subagents/types"

export const useGetSubAgentSummary = () => {
    const [data, setData] = useState<GetSingleAgentSummaryResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function getSubAgentSummaryData(params: GetSingleAgentSummaryParams) {
        setData(null)
        const response = await execute(async () => await SubAgentService().getSubAgentSummary(params));
        // console.log(response);
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, getSubAgentSummaryData }
}