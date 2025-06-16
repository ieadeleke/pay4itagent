import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ConsultantService } from "@/utils/services/consultant/index"
import { AddConsultantType } from "@/utils/services/consultant/types"


export const useWithdrawFromBank = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function withdrawFromBank(param: AddConsultantType) {
        // setData(null)
        const response = await execute(async () => await ConsultantService().addConsultant(param))
        if (response) {
            // setData(response);
            // updateUser(response.profile)
            setData(response)
        }
    }

    return { isLoading, error, data, withdrawFromBank }
}