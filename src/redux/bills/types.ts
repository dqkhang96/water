export interface IBill {
    _id: string
    code: string
    customerId: string
    numberBegin?: number
    numberEnd?: number
    consume?: number
    beforeTax?: number
    tax?: number
    fee?: number
    total?: number
    payed?: number
    datePay?: Date | null
    historyPay: [{
        payed: number
        datePay: Date
    }]
    rest?: number
    payTypeId: string
    tariffId: string
    glandId: string
    numberOfHouseholds: number
    numberOfPeople: number
    period: number
    numberBill: number
    dateBill: string
    frontDate: Date | null
    toDate: Date | null
    numberPrint?: number
    note?: string
    feeNumber: number
    isStored: boolean
}

export type Bill = IBill | { [key: string]: any }


export interface IChargeType {
    _id: string
    name: string
}

export interface IPayType {
    _id: string
    name: string
}
