import { useContext, useState } from "react"
import { useApi } from "../../index";
import { SubAgentService } from "@/utils/services/agents/subagents"
import { GetSingleAgentParams, GetSingleAgentResponse, WithdrawalStatusParams } from "@/utils/services/agents/subagents/types"
import UserContext from "@/context/UserContext";

export const useHandleUserWithdrawalStatus = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();
    const { updateUser, user } = useContext(UserContext)


    async function changeUserWithdrawalStatus(params: WithdrawalStatusParams) {
        setData(null)
        const response = await execute(async () => await SubAgentService().handleWithdrawalStatus(params));
        // console.log(response);
        if (response) {
            setData(response.user);
            // updateUser(response.user);
        }
    }

    return { isLoading, error, data, changeUserWithdrawalStatus }
}