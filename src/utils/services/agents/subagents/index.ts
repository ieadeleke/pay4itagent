import { request } from "@/utils/request";
import { ApiResponse } from "@/models";
import { GetSingleAgentParams, GetSingleAgentResponse, GetSingleAgentSummaryParams, GetSingleAgentSummaryResponse, WalletToWalletParams, WalletToWalletResponse, WithdrawalStatusParams, WithdrawalStatusResponse } from "./types";
import {
    AddAgentParams, AddAgentResponse, FreezeAgentParam, FreezeAgentResponse, FundWalletParams,
    FundWalletResponse, GetAllAgentsParams, GetAllAgentsResponse, SuspendAgentParams, SuspendAgentResponse,
    UpdateWalletParams, UpdateWalletResponse
} from "./types";


export function SubAgentService() {

    async function getSingleSubAgent(params: GetSingleAgentParams) {
        const response = await request({
            path: `v1/subAgent/DashboardInfo`,
            method: "POST",
            body: params
        })
        return response as GetSingleAgentResponse
    }

    async function handleWithdrawalStatus(params: WithdrawalStatusParams) {
        const response = await request({
            path: `v1/subAgent/${params.action === 'approve' ? 'ApproveBankTransfer' : 'DisallowBankTransfer'}`,
            method: "POST",
            body: params
        })
        return response as WithdrawalStatusResponse
    }

    async function getSubAgentSummary(params: GetSingleAgentSummaryParams) {
        const response = await request({
            path: `v1/subAgent/SubAgentWalletInfo`,
            method: "POST",
            body: params
        })
        return response as GetSingleAgentSummaryResponse
    }

    async function getAllAgents(payload: GetAllAgentsParams) {
        const data = await request({
            path: `v1/subAgent/GetAgents?page=${payload.page ?? 1}`,
            method: "GET",
            body: payload,
        });
        return data as GetAllAgentsResponse;
    }

    async function addNewAgent(payload: AddAgentParams) {
        const data = await request({
            path: `v1/subAgent/AddAgent`,
            method: "POST",
            body: payload,
        });
        return data as AddAgentResponse;
    }

    async function SuspendAgent(payload: SuspendAgentParams) {
        const data = await request({
            path: `v1/subAgent/SuspendAgent`,
            method: "POST",
            body: payload,
        });
        return data as SuspendAgentResponse;
    }

    async function UnSuspendAgent(payload: SuspendAgentParams) {
        const data = await request({
            path: `v1/subAgent/UnSuspendAgent`,
            method: "POST",
            body: payload,
        });
        return data as SuspendAgentResponse;
    }

    async function FreezeAgent(payload: FreezeAgentParam) {
        const data = await request({
            path: `v1/subAgent/FreezeCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FreezeAgentResponse;
    }

    async function UnFreezeAgent(payload: FreezeAgentParam) {
        const data = await request({
            path: `v1/subAgent/UnfreezeCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FreezeAgentResponse;
    }

    async function fundWallet(payload: FundWalletParams) {
        const data = await request({
            path: `v1/subAgent/FundCustomerWallet`,
            method: "POST",
            body: payload,
        });
        return data as FundWalletResponse;
    }

    async function walletToWalletTransfer(params: WalletToWalletParams) {
        const data = await request({
            path: `v1/agent/WalletToWalletTransfer`,
            method: "POST",
            body: params
        })
        return data as WalletToWalletResponse;
    }

    async function upgradeWallet(payload: UpdateWalletParams) {
        const data = await request({
            path: `v1/subAgent/UpgradeWallet`,
            method: "PUT",
            body: payload,
        });
        return data as UpdateWalletResponse;
    }

    return {
        getSingleSubAgent,
        getAllAgents,
        addNewAgent,
        SuspendAgent,
        UnSuspendAgent,
        FreezeAgent,
        UnFreezeAgent,
        fundWallet,
        upgradeWallet,
        walletToWalletTransfer,
        getSubAgentSummary,
        handleWithdrawalStatus
    };
}