import { useContext, useState } from "react"
import { useApi } from ".."
import { ProfileService } from "@/utils/services/profile"
import { RefreshAgentWalletParams, SetAgentPinParams } from "@/utils/services/profile/types"


export const useSetNewUserPin = () => {
    const [data, setData] = useState<any>({})
    const { isLoading, error, execute } = useApi()

    async function setNewPin(props: SetAgentPinParams) {
        // setData(null)
        const response = await execute(async () => await ProfileService().setNewUserPin(props))
        if (response) {
            setData(response.message);
        }
    }

    return { isLoading, error, data, setNewPin }
}