import { useState } from "react"
import { useApi } from "../index"
import { AgentService } from "../../services/agents";
import { AddLoanParams } from "@/utils/services/agents/types"

export const useAddNewLoan = () => {
    const [data, setData] = useState<any>(null);
    const { isLoading, error, execute } = useApi();

    async function addNewLoanRequest(params: AddLoanParams) {
        setData(null)
        const response = await execute(async () => await AgentService().addNewLoanRequest(params))
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, addNewLoanRequest }
}