
import {IBill,IChargeType,IPayType} from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_BILLS="LOAD_BILLS",
    ADD_BILL="ADD_BILL",
    DELETE_BILL="DELETE_BILL",
    LOAD_CHANGE_TYPES="LOAD_CHANGE_TYPES",
    ADD_CHANGE_TYPE="ADD_CHANGE_TYPE",
    DELETE_CHANGE_TYPE="DELETE_CHANGE_TYPE",
    LOAD_PAY_TYPES="LOAD_PAY_TYPES",
    ADD_PAY_TYPE="ADD_PAY_TYPE",
    DELETE_PAY_TYPE="DELETE_PAY_TYPE"
}

export interface loadBills { type: ActionTypes.LOAD_BILLS, payload: IBill[] }
export const loadBills = (bills: IBill[]) => action(ActionTypes.LOAD_BILLS, bills)

export interface addBill { type: ActionTypes.ADD_BILL, payload: IBill }
export const addBill = (bill: IBill) => action(ActionTypes.ADD_BILL, bill)

export interface deleteBill { type: ActionTypes.DELETE_BILL, payload: string }
export const deleteBill = (billId: number) => action(ActionTypes.DELETE_BILL, billId)

export interface loadChangeTypes { type: ActionTypes.LOAD_CHANGE_TYPES, payload: IChargeType[] }
export const loadChangeTypes = (changeTypes: IChargeType[]) => action(ActionTypes.LOAD_CHANGE_TYPES, changeTypes)

export interface addChangeType { type: ActionTypes.ADD_CHANGE_TYPE, payload: IChargeType }
export const addChangeType = (changeType: IChargeType) => action(ActionTypes.ADD_CHANGE_TYPE, changeType)

export interface deleteChangeType { type: ActionTypes.DELETE_CHANGE_TYPE, payload: string }
export const deleteChangeType = (changeTypeId: number) => action(ActionTypes.DELETE_CHANGE_TYPE, changeTypeId)

export interface loadPayTypes { type: ActionTypes.LOAD_PAY_TYPES, payload: IPayType[] }
export const loadPayTypes = (payTypes: IPayType[]) => action(ActionTypes.LOAD_PAY_TYPES, payTypes)

export interface addPayType { type: ActionTypes.ADD_PAY_TYPE, payload: IPayType }
export const addPayType = (payType: IPayType) => action(ActionTypes.ADD_PAY_TYPE, payType)

export interface deletePayType { type: ActionTypes.DELETE_PAY_TYPE, payload: string }
export const deletePayType = (payTypeId: number) => action(ActionTypes.DELETE_PAY_TYPE, payTypeId)


export type Actions=loadBills|addBill|deleteBill|loadChangeTypes|addChangeType|deleteChangeType|loadPayTypes|addPayType|deletePayType
