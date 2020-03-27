
import { ICustomer } from './types'
import { action, Action } from 'typesafe-actions'
export enum ActionTypes {
    LOAD_CUSTOMERS = "LOAD_CUSTOMERS",
    ADD_CUSTOMER = "ADD_CUSTOMER",
    DELETE_CUSTOMER = "DELETE_CUSTOMER",
    UPDATE_CUSTOMER_PROPERTY = "UPDATE_CUSTOMER_PROPERTY"
}

export interface loadCustomers { type: ActionTypes.LOAD_CUSTOMERS, payload: ICustomer[] }
export const loadCustomers = (customers: ICustomer[]) => action(ActionTypes.LOAD_CUSTOMERS, customers)

export interface addCustomer { type: ActionTypes.ADD_CUSTOMER, payload: ICustomer }
export const addCustomer = (customer: ICustomer) => action(ActionTypes.ADD_CUSTOMER, customer)

export interface deleteCustomer { type: ActionTypes.DELETE_CUSTOMER, payload: string | string[] }
export const deleteCustomer = (customerId: string | string[]) => action(ActionTypes.DELETE_CUSTOMER, customerId)

export interface updateCustomerProperty { type: ActionTypes.UPDATE_CUSTOMER_PROPERTY, payload: { _id: string, property: string, value: any } }
export const updateCustomerProperty = (id: string, property: string, value: any) => action(ActionTypes.UPDATE_CUSTOMER_PROPERTY, { _id: id, property, value })

export type Actions = loadCustomers | addCustomer | deleteCustomer | updateCustomerProperty
