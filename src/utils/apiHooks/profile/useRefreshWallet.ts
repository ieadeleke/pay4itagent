import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ProfileService } from "@/utils/services/profile"
import { RefreshAgentWalletParams } from "@/utils/services/profile/types"


export const useRefreshWallet = () => {
    const [data, setData] = useState<any>({})
    const { isLoading, error, execute } = useApi()
    const { updateUser } = useContext(UserContext)

    async function refreshWallet(props: RefreshAgentWalletParams) {
        // setData(null)
        const response = await execute(async () => await ProfileService().refreshAgentWallet(props))
        if (response) {
            setData(response);
        }
    }

    return { isLoading, error, data, refreshWallet }
}