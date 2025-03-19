export type Profile = {
    name: string
    addedBy: string
    email: string
    firstName: string
    isActive: boolean
    lastName: string
    loginCount: number
    loginDisabled: boolean
    loginReTryTime: string
    phoneNumber: string
    userName: string
    imgUrl: string
    profileType?: string
    wallet?: {
        _id: string
        accountName: string
        accountNumber: string
        accountReference: string
        availableBalance: number
        bankName: string
        bookedBalance: number
        country: string
        currency: string
        dailyTransactionLimit: number
        email: string
        maxBalance: number
        minBalance: number
        phoneNumber: string
        previousBalance: number
        provider: string
        providerCustomerId: string
        status: string
        tier: string
        type: string
        userId: string
    }
}