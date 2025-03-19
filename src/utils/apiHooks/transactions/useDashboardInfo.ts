import { useState } from "react"
import { useApi } from "../index"
import { TransactionService } from "@/utils/services/transactions"
import { DashboardInfoResponseParams } from "@/utils/services/transactions/types"

export const useDashboardInfo = () => {
    const [data, setData] = useState<DashboardInfoResponseParams | null>(null)
    const { isLoading, error, execute } = useApi()

    async function getDashboardInfo() {
        setData(null)
        const response = await execute(async () => await TransactionService().dashboardInfo())
        if (response) {
            setData(response)
        }
    }

    return { isLoading, error, data, getDashboardInfo }
}