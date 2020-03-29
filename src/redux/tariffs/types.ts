export interface ITariff {
    _id: string
    name: string
    code: string
    unit: number
    taxPercel: number
    tax: number
    total: number
    default: boolean
    active: boolean
}