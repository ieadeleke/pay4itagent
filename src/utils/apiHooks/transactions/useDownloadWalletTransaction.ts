import { useState } from "react"
import { useApi } from "../index"
import { DownloadReportParams } from "@/utils/services/transactions/types"
import { TransactionService } from "@/utils/services/transactions"

export const useDownloadSubAgentReport = () => {
    const [data, setData] = useState<string | null>(null)
    const { isLoading, error, execute } = useApi()

    async function downloadReport(params: DownloadReportParams) {
        setData(null)
        const response = await execute(async () => await TransactionService().downloadSubAgentWalletTransactionsReport(params))
        if (response) {
            setData(response as any)
        }
    }

    return { isLoading, error, data, downloadReport }
}