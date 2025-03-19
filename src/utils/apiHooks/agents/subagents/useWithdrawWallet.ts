import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents";
import { WithdrawWalletParams, WithdrawWalletResponse } from "@/utils/services/agents/types";

export const useWithdrawWallet = () => {
    const [data, setData] = useState<WithdrawWalletResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function withdrawWallet(params: WithdrawWalletParams) {
        setData(null)
        const response = await execute(async () => await AgentService().withdrawSubAgentWallet(params));
        if (response) {
            setData(response);
        }
    }
    
    return { isLoading, error, data, withdrawWallet }
}