export type Consultant = {
    name: Key | null | undefined
    _id: string,
    approve: boolean,
    chargeUserForAllTransactionFee: boolean,
    chargeUserForOnlySystemTransactionFee: boolean,
    DoNotChargeUserForTransactionFee: boolean,
    allowPartialPayment: boolean,
    maxServiceChargeStatus: boolean,
    _id: string,
    name: string,
    email: string,
    takeServiceChargeFromGovtCut: boolean,
    maxServiceCharge: number,
    minServiceCharge: number
    SplittingPercentageForConsultant: string,
    RevenueCode: string,
    RevenueName: string,
    settlementAccountName: string,
    settlementAccountNumber: string,
    settlementAccountCBNCode: string,
    settlementBankName: string,
    MDA: string,
    createdAt: string,
    updatedAt: string
}