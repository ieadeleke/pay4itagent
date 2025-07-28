import { ApiResponse } from "@/models"
import { GroupedTransactions, Transaction, WalletTransactionType } from "@/models/transactions"

export type GetTransactionsParams = {
    startDate: string,
    endDate: string,
    page?: number
}

export type GetWalletTransactionsParams = {
    walletId: string;
    startDate: string,
    endDate: string,
    page?: number
    category?: string
    type?: string
}

export type GetGroupedTransactionsResponse = ApiResponse & {
    transactions: GroupedTransactions[],
    count: number,
    page?: number
}

export type GetTransactionByReferenceParams = {
    reference: string,
    page?: number
}

export type GetTransactionByAgencyParams = {
    AgencyName: string,
    startDate?: string,
    endDate?: string
}

export type DownloadReportParams = {
    walletId: string
    startDate?: string,
    endDate?: string
    format?: string
    category?: string
    type?: string
}

export type DownloadConsolidatedReportParams = {
    startDate?: string,
    endDate?: string
    format?: string
    status?: string
}

export type DownloadSubAgentReportParams = {
    userId: string
    startDate?: string,
    endDate?: string
    format?: string
    category?: string
    type?: string
}

export type GetTransactionByPaymentRefParams = {
    paymentRef: string
}


export type GetTransactionsResponse = ApiResponse & {
    Transaction: Transaction[],
    count: number
}

export type GetWalletTransactionsResponse = ApiResponse & {
    Transaction: WalletTransactionType[],
    categoryEnum: any
    typeEnum: any
    count: number
}

export type GetTransactionsByReferenceResponse = ApiResponse & {
    Transactions: Transaction[],
    count: number
}

export type GetTransactionsByAgencyResponse = ApiResponse & {
    Transaction: Transaction[],
    count: number
}

export type GetTransactionByPaymentRefResponse = ApiResponse & {
    Transaction: Transaction
}

export type VerifyReferenceParams = {
    reference: string
}

export type DashboardInfoResponseParams = ApiResponse & {
    AllTransaction: number,
    TotalAmount: number,
    Agency: number,
    FailTransaction: number,
    SuccessfulTransaction: number,
    PendingTransaction: number,
    WeeklyTransactions: ({
        count: number,
        dayOfWeek: string
    })[],
    WeeklyAnalytics: ({
        status: string,
        count: number,
        percentage: number
    })[]
}

export type MakePaymentParams = {
    paymentRef: string,
    amountPaid: number,
    reference: string,
    email: string,
    AgencyName: string,
    RevName: string,
    OraAgencyRev: string,
    RevenueCode: string,
    PayerName: string,
    AgencyCode: string
}

export type PrintReceiptParams = {
    PaymentRef: string
}

export type MakePaymentResponse = ApiResponse & {
    ReceiptNumber: string
}