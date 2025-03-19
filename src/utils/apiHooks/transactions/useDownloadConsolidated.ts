import { useState } from "react"
import { useApi } from "../index"
import { DownloadConsolidatedReportParams, DownloadReportParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"

export const useDownloadAgentReport = () => {
    const [data, setData] = useState<string | null>(null)
    const { isLoading, error, execute } = useApi()

    async function downloadReport(params: DownloadConsolidatedReportParams) {
        setData(null)
        const response = await execute(async () => await TransactionService().downloadAgentConsolidatedTable(params))
        if (response) {
            setData(response as any)
        }
    }

    return { isLoading, error, data, downloadReport }
}