import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ConsultantService } from "@/utils/services/consultant/index"
import { AddConsultantType } from "@/utils/services/consultant/types"


export const useFetchBankList = () => {
    const [data, setData] = useState(null);
    const { isLoading, error, execute } = useApi();

    async function fetchBankList() {
        // setData(null)
        const response = await execute(async () => await ConsultantService().fetchBankList())
        if (response) {
            setData(response.banks);
            // updateUser(response.profile)
            // setData(response.profile)
        }
    }

    return { isLoading, error, data, fetchBankList }
}