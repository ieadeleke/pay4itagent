import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents";
import { FundWalletParams, FundWalletResponse } from "@/utils/services/agents/types";

export const useFundWallet = () => {
    const [data, setData] = useState<FundWalletResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function fundWallet(params: FundWalletParams) {
        setData(null)
        const response = await execute(async () => await AgentService().fundWallet(params))
        if (response) {
            setData(response);
        }
    }
    
    return { isLoading, error, data, fundWallet }
}