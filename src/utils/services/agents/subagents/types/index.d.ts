import { ApiResponse } from "@/models"

export type GetSingleAgentParams = {
    userId: string
}

export type WithdrawalStatusParams = {
    userId: string
    action: string
}

export type WithdrawalStatusResponse = ApiResponse & {
    message: string,
    user: any
}

export type GetSingleAgentSummaryParams = {
    agentId: string
}

export type GetSingleAgentSummaryResponse = ApiResponse & {
    message: string,
    totalAvailableBalance: number,
    totalBankTransferCreditOneWeek: number,
    totalBankTransferCreditToday: number,
    totalBankTransferCreditLastOneMonth: number,
    totalBillTransactionOneWeek: number,
    totalBillTransactionToday: number,
    totalBillTransactionLastOneMonth: number
}

export type GetSingleAgentResponse = ApiResponse & {
    message: string,
    Agent?: {
        _id: string,
        allowBankTransfer?: boolean
        name: string,
        email: string,
        createdAt: string,
        updatedAt: string
    }
}

export type GetTransactionsParams = {
    startDate: string,
    endDate: string,
    page?: number
}

export type GetAllAgentsParams = {
    page?: number,
}

export type GetAllAgentsResponse = ApiResponse & {
    Agents: any,
    page: number,
    count: number,
}

export type AddAgentParams = {
    email: string,
    userName: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    profileType: string
}

export type AddAgentResponse = ApiResponse & {
    message: string,
    status: string
}
export type SuspendAgentParams = {
    userId: string
}

export type SuspendAgentResponse = ApiResponse & {
    message: string,
    user: {
        _id: string,
        firstName: string,
        lastName: string,
        email: string,
        userName: string,
        phoneNumber: string,
        isActive: boolean
    }
}

export type FreezeAgentParam = {
    accountNumber: string,
}

export type FreezeAgentResponse = ApiResponse & {
    message: string,
    user: {
        _id: string,
        firstName: string,
        lastName: string,
        email: string,
        userName: string,
        phoneNumber: string,
        isActive: boolean
    }
}

export type FundWalletParams = {
    accountNumber: string,
    amount: number,
    fee: number,
    vat: number,
    description: string
}

export type FundWalletResponse = ApiResponse & {
    message: string,
    status: string
}

export type WalletToWalletParams = {
    accountName: number,
    amount: number,
    description: string
}

export type WalletToWalletResponse = ApiResponse & {
    message: string,
    status: string,
    WalletToWalletTransfer: any
}

export type UpdateWalletParams = {
    accountNumber: string,
    tier: string
}

export type UpdateWalletResponse = ApiResponse & {
    message: string,
    status: string
}