
export type Payment = {
    agent(agent: any): unknown;
    PaymentStatus: boolean,
    Status: string,
    _id: string,
    AgencyCode: string,
    AgencyName: string,
    PayerName: string,
    RevenueCode: string,
    reference: string,
    OraAgencyRev: string,
    RevName: string,
    amountPaid: string,
    email: string,
    paymentRef: string,
    mobile: string,
    serviceCharge: string,
}