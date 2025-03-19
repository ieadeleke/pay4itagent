export type Reference = {
    AmountDue: string,
    Status: string,
    CreditAccount: string,
    PayerName: string,
    AgencyCode: string,
    RevenueCode: string
    OraAgencyRev: string,
    State: string,
    StatusMessage: string,
    Pid: string,
    Currency: string,
    AcctCloseDate: string,
    ReadOnly: string,
    MinAmount: string,
    MaxAmount: string,
    PaymentFlag: string,
    CbnCode: string,
    AgencyName: string,
    RevName: string,
    settings: {
        percentage: number,
        min: number,
        max: number
    },
    subaccount_id: string,
    settlementAccounts: ({
        id: string
    })[],
    subAccount: ({
        id: string
    })[],
    ConsultantSubAccount?: string
}

export type HarmonizeReference = {
    TotalAmount: number;
    bulkBill: {
        TotalDue: number;
        ParentGUid: string;
        Pid: string;
        PayerName: string;
        Status: string;
        StatusMessage: string;
        paymentRef: string;
        Webguid: [
            {
                min: string;
                AmountDue: string;
                webguid: string;
                Order: string;
                Flag_RO: string;
                Flag_MinAmt: string;
                Flag_MaxAmt: string;
                CreditAccount: string;
                PayerName: string;
                AgencyCode: string;
                RevenueCode: string;
                OraAgencyRev: string;
                State: string;
                StatusMessage: string;
                Pid: string;
                Currency: string;
                AcctCloseDate: string;
                ReadOnly: string;
                MinAmount: string;
                MaxAmount: string;
                PaymentFlag: string;
                CbnCode: string;
                AgencyName: string;
                RevName: string;
                serviceCharge: string;
            }
        ];
        State: string;
        PayerName: string;
        TotalDue: number;
        ParentGUid: string;
        email: string;
        mobile: string;
    };
    settings: {
        percentage: number;
        min: number;
        max: number;
    };
};