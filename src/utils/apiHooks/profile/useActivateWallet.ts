import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ProfileService } from "@/utils/services/profile"
import { ActivateAgentWalletParams, ActivateAgentWalletResponse } from "@/utils/services/profile/types"


export const useActivateUserWallet = () => {
    const [data, setData] = useState<ActivateAgentWalletResponse>({})
    const { isLoading, error, execute } = useApi();

    async function activateAgentWallet(params: ActivateAgentWalletParams) {
        const response = await execute(async () => await ProfileService().activateAgentWallet(params))
        if (response) {
            console.log(response)
            setData(response);
        }
    }

    return { isLoading, error, data, activateAgentWallet }
}