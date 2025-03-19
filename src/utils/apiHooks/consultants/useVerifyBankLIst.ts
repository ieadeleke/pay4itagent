import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ConsultantService } from "@/utils/services/consultant/index"
import { AddConsultantType, BankDataVerification } from "@/utils/services/consultant/types"


export const useVerifyBankList = () => {
    const [data, setData] = useState(null);
    const { isLoading, error, execute } = useApi();

    async function verifyBankData(params: BankDataVerification) {
        // setData(null)
        const response = await execute(async () => await ConsultantService().verifyBankData(params));
        if (response) {
            console.log(response);
            // setData(response);
            // updateUser(response.profile)
            // setData(response.profile)
        }
        console.log(error)
    }

    return { isLoading, error, data, verifyBankData }
}