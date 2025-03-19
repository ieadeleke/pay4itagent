import { ApiResponse } from "@/models"
import { Payment } from "@/models/payment"

export type VerifyReferenceParams = {
    apiKey: string,
    reference: string
}

export type VerifyHarmonizeReferenceParams = {
    reference: string;
};

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

export type InitiateHarmonizedPaymentParams = {
    paymentRef: string;
    Webguid: [
        {
            CreditAccount: string;
            CbnCode: string;
            AmountDue: string;
            serviceCharge: string;
            AgencyName: string;
            RevName: string;
            OraAgencyRev: string;
            RevenueCode: string;
            PayerName: string;
            AgencyCode: string;
            Pid: string;
        }
    ];
    PayerName: string;
    TotalDue: number;
    ParentGUid: string;
    email: string;
    mobile: string;
    wallet: boolean;
    userName: string;
};
export type InitiateHarmonizedPaymentResponse = {
    Transaction: Payment[];
};


export type PrintReceiptParams = {
    PaymentRef: string
}

export type MakePaymentResponse = ApiResponse & {
    ReceiptNumber: string
}

export type InitiatePaymentParams = {
    apiKey: string,
    paymentRef: string,
    amountPaid: number,
    reference: string,
    email: string,
    AgencyName: string,
    RevName: string,
    OraAgencyRev: string,
    RevenueCode: string,
    PayerName: string,
    AgencyCode: string,
    serviceCharge: string,
    mobile: string,
    Pid: string,
    CreditAccount: string,
    subAccount: ({
        id: string
    })[]
}

export type InitiatePaymentWithUpperLinkResponse = {
    Transaction: Payment
}

export type PaymentNotificationParams = {
    reference: string,
    transaction_id: string
}

export type UpperLinkPaymentNotificationResponse = {
    payload: Payment,
    ReceiptNumber: string
}


export type UpperLinkWalletPaymentNotificationParams = {
    reference: string;
    otp: string;
};

export type UpperLinkPaymentNotificationParams = {
    reference: string;
    transaction_id: string;
};

export type HarmonizedPaymentNotificationResponse = {
    WebGuid: string;
    ResponseCode: string;
    ResponseDesc: string;
    ReceiptNumber: null;
    State: string;
    Status: string;
    TransID: string;
    TransCode: string;
    StatusMessage: string;
    Receipt: string[];
    payload: Payment;
};

export type MDAPaymentNotificationParams =
    UpperLinkPaymentNotificationParams & {
        apiKey: string;
    };