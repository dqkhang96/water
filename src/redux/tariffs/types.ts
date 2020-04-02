export interface ITariff {
    _id: string
    name: string
    code: string
    unit: number
    taxPercel: number
    tax: number
    total: number
    typeOfPrice: TypeOfPrice
    rangePrices: RangePrice[]
    default: boolean
    active: boolean
}

export interface RangePrice {
    to: number,
    unit: number
}

export enum TypeOfPrice {
    FIXED,
    DIVISION
}

export enum WaterUnit {
    CUBIC_METERS
}