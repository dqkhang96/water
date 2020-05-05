export interface ICustomer {
    _id: string
    code: string
    name: string
    waterMeterCode: string
    address: string
    tariffId: string
    glandId: string
    numberOfHouseholds: number
    numberOfPeople: number
    // phoneNumber: string
    // taxCode: string
    // email: string
    customerType: CustomerType
    owner: string
    rentAddress: string
    contractCode: string
    contractDate: Date | null
    chargeTypeId: string
    payTypeId: string
    //environmentalProtectionFee: number
    bankId: string
    beginUse: Date | null
    endUse: Date | null
    active: boolean
}

export enum CustomerType {
    ENTERPRISE,
    PERSONAL
}