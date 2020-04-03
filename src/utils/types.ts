export enum PageIds {
    BILLS,
    CUSTOMERS,
    BANKS,
    GLANDS,
    TARIFFS,
    SETTING,
    PAY_TYPES
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
    BANK,
    PAY_TYPE
}


export interface SearchOption {
    property: string
    key: string
    id: string | number
}