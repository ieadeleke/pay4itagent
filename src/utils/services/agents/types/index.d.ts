import { ApiResponse } from "@/models"
import { GroupedTransactions, Transaction } from "@/models/transactions"

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

export type GetAllAgentsSummaryParams = {
    page?: number,
}

export type GetAllAgentsSummaryResponse = ApiResponse & {
    message: any
    AllTransaction: number
    TotalAmount: number
    TotalAmountSuccessful: number
    FailTransaction: number
    SuccessfulTransaction: number
    PendingTransaction: number
    WeeklyTransactions: any
    WeeklyAnalytics: any
}

export type GetAllAgentsTransactionHistoryParams = {
    page?: string;
    startDate: string;
    endDate: string;
    perPage?: number;
    status?: string;
}

export type GetAllLoanHistoryParams = {
    status?: string;
}

export type UpdateLoanRequestParams = {
    loanId: string;
    amount?: number;
}

export type ReprocessPaymentParams = {
    paymentRef?: string;
}

export type ReprocessPaymentResponse = {
    payload?: any;
    data?: any;
}

export type ReversePaymentResponse = {
    Wallet?: any;
    Transaction?: any;
}

export type GetAllAgentsTransactionHistoryResponse = ApiResponse & {
    message: any,
    transactions: any,
    Transaction?: any,
    count: number,
}

export type AddAgentParams = {
    email: string,
    userName: string,
    phoneNumber: string,
    firstName: string,
    lastName: string
}

export type AddLoanParams = {
    loanAmount: string,
    endDate?: string | Date
}

export type AddLoanResponse = {
    LoanRequest?: any
}

export type AddAgentResponse = ApiResponse & {
    message: string,
    status: string
}
export type SuspendAgentParams = {
    userId: string,
    status: boolean
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

export type TransactionHistoryParams = {
    walletId: string
}

export type TransactionHistoryResponse = ApiResponse & {
    message: string,
    status: string
}

export type WithdrawWalletParams = {
    userId: string,
    amount: number,
    description?: string
}

export type SubAgentTransactionHistoryParams = {
    page?: number;
    walletId: string
    startDate?: string;
    endDate: string
}

export type AgentTransactionHistoryByDateRangeResponse = {
    message: string,
    status: string,
    count?: number;
    Transactions: any
}

export type SubAgentTransactionHistoryByDateRangeResponse = {
    message: string,
    status: string,
    count?: number;
    transactions: any
}


export type AgentTransactionHistoryByDateRangeParams = {
    page?: number;
    walletId: string;
    startDate?: string;
    endDate: string;
    type?: any;
    category?: any;
}

export type SubAgentTransactionHistoryResponse = {
    message: string,
    status: string,
    count?: number;
    transactions: any;
    typeEnum: any;
    categoryEnum: any;
}

export type SubAgentTotalTransactionHistoryParams = {
    page?: string;
    userId: string;
    startDate: string;
    endDate: string;
}

export type SubAgentTotalTransactionHistoryResponse = {
    message: string,
    status: string,
    count?: number;
    Transaction: any
}

export type WithdrawWalletResponse = ApiResponse & {
    message: string,
    status: string
}

export type UpdateWalletParams = {
    accountNumber: string,
    tier: string
}

export type UpdateWalletResponse = ApiResponse & {
    message: string,
    status: string
}

export type TransferToWalletParams = {
    accountNumber: string
    amount: number
    description?: string;
    pin?: string
}

export type TransferToWalletResponse = ApiResponse & {
    message: string,
    status: string,
    WalletToWalletTransfer: any
}

export type DownloadReportParams = {
    walletId: string
    startDate?: string,
    endDate?: string
    type?: any;
    category?: any;
}