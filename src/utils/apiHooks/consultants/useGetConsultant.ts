import { useState } from "react"
import { useApi } from "../index"
import { ConsultantService } from "@/utils/services/consultant"
import { GetSingleConsultantType } from "@/utils/services/consultant/types"

export const useGetConsultantById = () => {
    const [data, setData] = useState<any>({})
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState(0)

    async function fetchConsultants(MdaID: GetSingleConsultantType) {
        setData([])
        const response = await execute(async () => await ConsultantService().getSingleConsultant(MdaID))
        if (response) {
            setData(response);
        }
    }

    return { isLoading, error, data, fetchConsultants, count }
}