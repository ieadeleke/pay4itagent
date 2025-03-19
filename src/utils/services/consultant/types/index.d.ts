import { ApiResponse } from "@/models"

export type GetConsultantsParams = {
    // startDate: string,
    // endDate: string,
    page?: number
}

export type AddConsultantType = {
    accountNumber: string,
    accountName: string,
    sortCode: string,
    amount: string,
    description: string,
    pin: string
}
export type EditConsultantType = {
    MDAConsultantId: STRING
    name: string,
    email: string,
    RevenueCode: string,
    RevenueName: string,
    settlementAccountNumber: string,
    settlementBankName: string,
    settlementAccountName: string,
    settlementAccountCBNCode: string,
    minServiceCharge: string,
    maxServiceCharge: string,
    SplittingPercentageForConsultant: string,
    chargeUserForTransactionFee: Boolean,
    chargeUserForOnlySystemTransactionFee: Boolean,
    DoNotChargeUserForTransactionFee: Boolean,
    allowPartialPayment: Boolean,
    maxServiceChargeStatus: Boolean,
    takeServiceChargeFromGovtCut: Boolean
}


export type BankDataVerification = {
    accountNumber: string,
    sortCode: string
}

export type GetSingleConsultantType = {
    consultantId: string | string[]
}

export type BankDataVerificationResponse = ApiResponse & {
    CreditAccount: string,
    CbnCode: string
}

export type BankListResponse = ApiResponse;

export type SingleConsultantResponse = ApiResponse;