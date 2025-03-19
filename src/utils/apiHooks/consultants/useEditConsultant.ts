import { useContext, useState } from "react"
import { useApi } from ".."
import { Profile } from "@/models/profile"
import UserContext from "@/context/UserContext"
import { ConsultantService } from "@/utils/services/consultant/index"
import { AddConsultantType, EditConsultantType } from "@/utils/services/consultant/types"


export const useEditConsultant = () => {
    const [data, setData] = useState(null);
    const { isLoading, error, execute } = useApi();

    async function updateConsultant(param: EditConsultantType) {
        // setData(null)
        const response = await execute(async () => await ConsultantService().editConsultant(param))
        if (response) {
            // setData(response);
            // updateUser(response.profile)
            setData(response)
        }
    }

    return { isLoading, error, data, updateConsultant }
}