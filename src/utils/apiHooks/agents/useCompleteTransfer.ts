import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { AgentService } from "@/utils/services/agents";
import { TransferToWalletParams } from "@/utils/services/agents/types";


export const useCompleteTransfer = () => {
    const [data, setData] = useState({
        message: "",
        WalletToWalletTransfer: {}
    });
    const { isLoading, error, execute } = useApi();

    async function completeWalletTransfer(params: TransferToWalletParams) {
        // setData(null)
        const response = await execute(async () => await AgentService().transferToWallet(params));
        if (response) {
            setData({
                message: response.message,
                WalletToWalletTransfer: response.WalletToWalletTransfer
            });
            // updateUser(response.profile)
            // setData(response.profile)
        }
    }

    return { isLoading, error, data, completeWalletTransfer }
}