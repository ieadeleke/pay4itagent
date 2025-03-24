type WalletType = {
    availableBalance?: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    phoneNumber: string;
    email: string;
    tier: string;
    type: string;
    maxBalance: number;
    dailyTransactionLimit: number;
}

export type AllAgentType = {
    firstName: string;
    lastName: string;
    name: string,
    email: string,
    phoneNumber: string,
    createdAt: string,
    wallet?: WalletType,
}