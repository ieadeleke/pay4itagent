import { request } from "../../request";
import { GetTransactionByPaymentRefResponse, GetWalletTransactionsParams, GetWalletTransactionsResponse } from "../transactions/types";
import {
    AddAgentParams, AddAgentResponse, AgentTransactionHistoryByDateRangeParams, AgentTransactionHistoryByDateRangeResponse, DownloadReportParams, FreezeAgentParam, FreezeAgentResponse, FundWalletParams,
    FundWalletResponse, GetAllAgentsParams, GetAllAgentsResponse, GetAllAgentsSummaryResponse, GetAllAgentsTransactionHistoryParams, GetAllAgentsTransactionHistoryResponse, ReprocessPaymentParams, ReprocessPaymentResponse, ReversePaymentResponse, SubAgentTotalTransactionHistoryParams, SubAgentTotalTransactionHistoryResponse, SubAgentTransactionHistoryByDateRangeResponse, SubAgentTransactionHistoryParams, SubAgentTransactionHistoryResponse, SuspendAgentParams, SuspendAgentResponse,
    TransactionHistoryParams,
    TransactionHistoryResponse,
    TransferToWalletParams,
    TransferToWalletResponse,
    UpdateWalletParams, UpdateWalletResponse,
    WithdrawWalletParams,
    WithdrawWalletResponse
} from "./types";

export function AgentService() {
    async function getAllAgents(payload: GetAllAgentsParams) {
        const data = await request({
            path: `v1/SubAgent/GetSubAgents?page=${payload.page ?? 1}`,
            method: "GET",
            body: payload,
        });
        return data as GetAllAgentsResponse;
    }

    async function getAllAgentsSummary() {
        const data = await request({
            path: `v1/SubAgent/ConsolidatedDashboardInfo`,
            method: "GET",
            body: "",
        });
        return data as GetAllAgentsSummaryResponse;
    }

    async function getAllAgentsTransactionHistory(param: GetAllAgentsTransactionHistoryParams) {
        const data = await request({
            path: `v1/SubAgent/GetConsolidatedTransactions`,
            method: "POST",
            body: param,
        });
        return data as GetAllAgentsTransactionHistoryResponse;
    }

    async function ReProcessAgentPayment(param: ReprocessPaymentParams) {
        const data = await request({
            path: `v1/agent/payment/ReprocessPayment`,
            method: "POST",
            body: param,
        });
        return data as ReprocessPaymentResponse;
    }

    async function ReverseAgentPayment(param: ReprocessPaymentParams) {
        const data = await request({
            path: `v1/agent/payment/ReversePayment`,
            method: "POST",
            body: param,
        });
        return data as ReversePaymentResponse;
    }

    async function addNewAgent(payload: AddAgentParams) {
        const data = await request({
            path: `v1/SubAgent/AddAgent`,
            method: "POST",
            body: payload,
        });
        return data as AddAgentResponse;
    }

    async function downloadReport(payload: DownloadReportParams) {
        const data = await request({
            path: `v1/subAgent/DownloadWalletTransaction?walletId=${payload.walletId}&startDate=${payload.startDate}&endDate=${payload.endDate}&category=${payload.category}&type=${payload.type}`,
            body: payload,
            headers: {
                Accept: 'text/csv'
            },
            method: "GET"
        }, "download")
        return data as GetTransactionByPaymentRefResponse
    }

    async function SuspendAgent(payload: SuspendAgentParams) {
        if (payload.status) {
            const data = await request({
                path: `v1/SubAgent/SuspendAgent`,
                method: "POST",
                body: { userId: payload.userId },
            });
            return data as SuspendAgentResponse;
        } else {
            const data = await request({
                path: `v1/SubAgent/UnSuspendAgent`,
                method: "POST",
                body: { userId: payload.userId },
            });
            return data as SuspendAgentResponse;
        }
    }

    async function UnSuspendAgent(payload: SuspendAgentParams) {
        const data = await request({
            path: `v1/SubAgent/UnSuspendAgent`,
            method: "POST",
            body: payload,
        });
        return data as SuspendAgentResponse;
    }

    async function FreezeAgent(payload: FreezeAgentParam) {
        const data = await request({
            path: `v1/SubAgent/FreezeCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FreezeAgentResponse;
    }

    async function UnFreezeAgent(payload: FreezeAgentParam) {
        const data = await request({
            path: `v1/SubAgent/UnfreezeCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FreezeAgentResponse;
    }
    async function FetchTransactionHistory(payload: TransactionHistoryParams) {
        const data = await request({
            path: `v1/SubAgent/ViewWalletTransaction`,
            method: "POST",
            body: payload,
        });
        return data as TransactionHistoryResponse;
    }

    async function fundWallet(payload: FundWalletParams) {
        const data = await request({
            path: `v1/SubAgent/FundCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FundWalletResponse;
    }

    async function withdrawSubAgentWallet(payload: WithdrawWalletParams) {
        const data = await request({
            path: `v1/SubAgent/WithdrawFromSubAgentWallet`,
            method: "POST",
            body: payload,
        });
        return data as WithdrawWalletResponse;
    }

    async function getSubAgentTransactionHistory(payload: SubAgentTransactionHistoryParams) {
        const data = await request({
            path: `v1/subAgent/ViewWalletTransaction?page=${payload.page || 1}`,
            method: "POST",
            body: payload
        })
        return data as SubAgentTransactionHistoryResponse
    }

    async function getSubAgentTransactionHistoryByDate(payload: AgentTransactionHistoryByDateRangeParams) {
        const data = await request({
            path: `v1/subAgent/ViewWalletTransaction?page=${payload.page || 1}&walletId=${payload.walletId}&startDate=${payload.startDate}&endDate=${payload.endDate}`,
            method: "POST",
            body: payload
        })
        return data as SubAgentTransactionHistoryByDateRangeResponse;
    }

    async function getSubAgentTotalTransactionHistory(payload: SubAgentTotalTransactionHistoryParams) {
        const data = await request({
            path: `v1/subAgent/GetAgentTransactions?page=${payload.page || 1}`,
            method: "POST",
            body: payload
        })
        return data as SubAgentTotalTransactionHistoryResponse
    }

    async function upgradeWallet(payload: UpdateWalletParams) {
        const data = await request({
            path: `v1/SubAgent/UpgradeWallet`,
            method: "PUT",
            body: payload,
        });
        return data as UpdateWalletResponse;
    }

    async function transferToWallet(payload: TransferToWalletParams) {
        const data = await request({
            path: `v1/agent/WalletToWalletTransfer`,
            method: "POST",
            body: payload,
        });
        return data as TransferToWalletResponse;
    }

    return {
        getAllAgents,
        addNewAgent,
        SuspendAgent,
        UnSuspendAgent,
        FreezeAgent,
        UnFreezeAgent,
        fundWallet,
        upgradeWallet,
        withdrawSubAgentWallet,
        FetchTransactionHistory,
        getSubAgentTransactionHistory,
        getSubAgentTotalTransactionHistory,
        transferToWallet,
        getSubAgentTransactionHistoryByDate,
        downloadReport,
        getAllAgentsSummary,
        getAllAgentsTransactionHistory,
        ReProcessAgentPayment,
        ReverseAgentPayment
    };
}
