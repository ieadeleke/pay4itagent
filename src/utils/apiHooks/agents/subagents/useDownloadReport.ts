import { useState } from "react"
import { useApi } from "../../index";
import { DownloadReportParams } from "@/utils/services/transactions/types"
import { AgentService } from "@/utils/services/agents";
import { AgentTransaction } from "@/models/transactions";

export const useDownloadReport = () => {
    const [data, setData] = useState<string | null>(null)
    const { isLoading, error, execute } = useApi()

    async function downloadReport(params: DownloadReportParams) {
        setData(null)
        const response = await execute(async () => await AgentService().downloadReport(params))
        if (response) {
            setData(response as any)
        }
    }

    return { isLoading, error, data, downloadReport }
}