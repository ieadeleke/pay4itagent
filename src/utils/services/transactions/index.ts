import { request } from "../../request"
import { GetTransactionByPaymentRefParams, GetTransactionByReferenceParams, GetTransactionByPaymentRefResponse, GetTransactionsByReferenceResponse, GetTransactionsParams, GetTransactionsResponse, DownloadReportParams, DashboardInfoResponseParams, GetWalletTransactionsParams, GetWalletTransactionsResponse, DownloadSubAgentReportParams, DownloadConsolidatedReportParams } from "./types"


export function TransactionService() {

    async function getTransactions(payload: GetTransactionsParams) {
        const data = await request({
            path: `v1/agent/transaction/GetAgentTransactions?page=${payload.page || 1}`,
            method: "POST",
            body: payload
        })
        return data as GetTransactionsResponse
    }

    async function getSubAgentTransactions(payload: GetTransactionsParams) {
        const data = await request({
            path: `v1/subAgent/GetAgentTransactions?page=${payload.page || 1}`,
            method: "POST",
            body: payload
        })
        return data as GetTransactionsResponse
    }

    async function getWalletTransactions(payload: GetWalletTransactionsParams) {
        const data = await request({
            path: `v1/agent/ViewWalletTransaction?page=${payload.page || 1}`,
            method: "PUT",
            body: payload
        })
        return data as GetWalletTransactionsResponse;
    }

    async function getTransactionsByReference(payload: GetTransactionByReferenceParams) {
        const data = await request({
            path: `v1/agent/transaction/GetTransactionByReference?page=${payload.page || 1}`,
            body: payload,
            method: "POST"
        })
        return data as GetTransactionsByReferenceResponse
    }

    async function getTransactionByPaymentRef(payload: GetTransactionByPaymentRefParams) {
        const data = await request({
            path: `v1/agent/transaction/GetTransactionByPaymentRef`,
            body: payload,
            method: "POST"
        })
        return data as GetTransactionByPaymentRefResponse
    }

    async function downloadReport(payload: DownloadReportParams) {
        const data = await request({
            path: `v1/agent/transaction/DownloadReport?walletId=${payload.walletId}&startDate=${payload.startDate}&endDate=${payload.endDate}&format=${payload.format}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function downloadSubAgentReport(payload: DownloadSubAgentReportParams) {
        const data = await request({
            path: `v1/subAgent/DownloadReport?userId=${payload.userId}&startDate=${payload.startDate}&endDate=${payload.endDate}&format=${payload.format}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function downloadSubAgentWalletTransactionsReport(payload: DownloadReportParams) {
        const data = await request({
            path: `v1/subAgent/DownloadWalletTransaction?&startDate=${payload.startDate}&endDate=${payload.endDate}&format=${payload.format}&category=${payload.category}&type=${payload.type}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function downloadAgentWalletTransactionsReport(payload: DownloadReportParams) {
        const data = await request({
            path: `v1/agent/DownloadWalletTransaction?&startDate=${payload.startDate}&endDate=${payload.endDate}&format=${payload.format}&category=${payload.category}&type=${payload.type}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function downloadAgentConsolidatedTable(payload: DownloadConsolidatedReportParams) {
        const data = await request({
            path: `v1/subagent/DownloadConsolidatedTable?&startDate=${payload.startDate}&endDate=${payload.endDate}&format=${payload.format}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function dashboardInfo() {
        const data = await request({
            path: `v1/agent/transaction/DashboardInfo`,
            method: "GET"
        })
        return data as DashboardInfoResponseParams
    }

    return {
        getTransactions,
        getTransactionsByReference,
        getTransactionByPaymentRef,
        dashboardInfo,
        downloadReport,
        getWalletTransactions,
        downloadSubAgentWalletTransactionsReport,
        downloadAgentWalletTransactionsReport,
        downloadSubAgentReport,
        getSubAgentTransactions,
        downloadAgentConsolidatedTable
    }
}