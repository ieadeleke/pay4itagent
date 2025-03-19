import { useState } from "react"
import { useApi } from "../index"
import { ConsultantService } from "@/utils/services/consultant"

export const useFetchConsultants = () => {
    const [data, setData] = useState<any[]>([])
    const { isLoading, error, execute } = useApi()
    const [count, setCount] = useState(0)

    async function fetchConsultants(pageNum: string) {
        setData([])
        const response = await execute(async () => await ConsultantService().getConsultants(pageNum))
        if (response) {
            setData(response.Consultants)
            setCount(response.count)
        }
    }

    return { isLoading, error, data, fetchConsultants, count }
}