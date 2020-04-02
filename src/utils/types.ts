export enum PageIds {
    BILLS,
    CUSTOMERS,
    BANKS,
    GLANDS,
    TARIFFS
}

export enum Types {
    STRING,
    NUMBER,
    DATETIME,
    BANK,
    GLAND,
    TARIFF,
    CHARGE_TYPE,
    PAY_TYPE,
    BOOLEAN,
    TYPE_OF_PRICE,
    RANGE_PRICES,
    CUSTOMER_TYPE
}


export enum TableTypes {
    BILL,
    TARIFF,
    CUSTOMER,
    GLAND,
    BANK
}


export interface SearchOption {
    property: string
    key: string
    id: string | number
}