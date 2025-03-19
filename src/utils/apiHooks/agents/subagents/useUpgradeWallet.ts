import { useState } from "react"
import { useApi } from "../../index"
import { AgentService } from "@/utils/services/agents";
import { UpdateWalletParams, UpdateWalletResponse } from "@/utils/services/agents/types";

export const useUpgradeWallet = () => {
    const [data, setData] = useState<UpdateWalletResponse | null>(null);
    const { isLoading, error, execute } = useApi();

    async function upgradeWallet(params: UpdateWalletParams) {
        setData(null)
        const response = await execute(async () => await AgentService().upgradeWallet(params))
        if (response) {
            console.log(response);
            setData(response);
        }
    }
    
    return { isLoading, error, data, upgradeWallet }
}