type DataType = {
    _id: string,
    AgencyCode: string,
    AgencyName: string,
    PayerName: string,
    RevenueCode: string,
    reference: string,
    OraAgencyRev: string,
    RevName: string,
    Status: "Pending" | "Successful" | "Fail"
    amountPaid: number,
    serviceCharge?: string,
    paymentRef: string,
    Webguid?: any[],
    NotificationDetails: {
        WebGuid: string,
        ResponseCode: string,
        ResponseDesc: string,
        ReceiptNumber: string,
        State: string,
        Status: string,
        TransID: string,
        TransCode: string,
        StatusMessage: string,
        Receipt: [string],
        PropertyAddress: null
    },
    paymentDetails?: {
        status: string,
        message: string,
        data: {
            id: string,
            tx_ref: string,
            flw_ref: string,
            device_fingerprint: string,
            amount: string,
            currency: string,
            charged_amount: string,
            app_fee: string,
            merchant_fee: string,
            processor_response: string,
            auth_model: string,
            ip: string,
            narration: string,
            status: string,
            payment_type: string,
            card: {
                first_6digits: string,
                last_4digits: string,
                type: string,
                country: string
            },
            created_at: string,
            account_id: string,
            meta: {
                __CheckoutInitAddress: string,
            },
            amount_settled: 19720,
            customer: {
                id: string,
                name: string,
                phone_number: string,
                email: string,
                created_at: string,
            }
        }
    },
    subaccounts?: ({
        id: string,
        transaction_charge_type: string,
        transaction_charge: number,
        account_number: string,
        account_bank: string
    })[],
    createdAt: string,
    updatedAt: string
}

export type Transaction = DataType;

type AgentTransactionType = {
    createdAt: string,
    amount: number
    balance_after: number
    balance_before: number
    category: string
    currency: string
    description: string
    reference: string
    status: string
    total: number
    type: string
    walletId: string
}

export type AgentTransaction = AgentTransactionType;

export type WalletTransactionType = {
    createdAt: string,
    amount: number
    balance_after: number
    balance_before: number
    category: string
    currency: string
    description: string
    reference: string
    status: string
    total: number
    type: string
    walletId: string
}

export type GroupedTransactions = {
    _id: string,
    totalAmountPaid: number,
    transactions: Transaction[]
}