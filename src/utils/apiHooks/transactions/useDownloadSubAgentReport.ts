import { useState } from "react"
import { useApi } from "../index"
import { DownloadReportParams, DownloadSubAgentReportParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"

export const useDownloadReport = () => {
    const [data, setData] = useState<string | null>(null)
    const { isLoading, error, execute } = useApi()

    async function downloadReport(params: DownloadSubAgentReportParams) {
        setData(null)
        const response = await execute(async () => await TransactionService().downloadSubAgentReport(params))
        if (response) {
            setData(response as any)
        }
    }

    return { isLoading, error, data, downloadReport }
}