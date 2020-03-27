export interface IBill {
    _id:string
    code:string
    customerId:number
    numberBegin?:number
    numberEnd?:number
    beforeTax?:number
    tax?:number
    fee?:number
    total?:number
    payed?:number
    datePay?:string
    payTypeId:string
    tariffId:string
    glandId:string
    numberOfHouseholds:number
    numberOfPeople:number
    period:number
    dateBill:string
    frontDate:string
    toDate:string
    numberPrint?:number
    note?:string
}


export interface IChargeType {
    _id:string
    name:string
}

export interface IPayType {
    _id:string
    name:string
}
