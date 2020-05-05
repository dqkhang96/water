export interface IBill {
    _id: string
    code: string
    customerId: string
    numberBegin?: number
    numberEnd?: number
    consume?: number
    beforeTax?: number
    tax?: number
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
    customerCode: string
    month: Date
    customerName?: string
    customerAddress?: string
    numberOfHouseholds: number
    numberOfPeople: number
    period: number
    numberBill: number
    dateBill: Date
    fromDate: Date | null
    toDate: Date | null
    numberPrint?: number
    note?: string
    //fee?: number
    //feeNumber: number
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
    code: string
    default: boolean
    active: boolean
}
