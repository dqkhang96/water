
import { ISetting } from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_SETTING = "LOAD_SETTING",
    CHANGE_BILL_DATE = "CHANGE_BILL_DATE"
}

export interface loadSetting { type: ActionTypes.LOAD_SETTING, payload: ISetting }
export const loadSetting = (setting: ISetting) => action(ActionTypes.LOAD_SETTING, setting)

export interface changeBillDate { type: ActionTypes.CHANGE_BILL_DATE, payload: number }
export const changeBillDate = (billDate: number) => action(ActionTypes.CHANGE_BILL_DATE, billDate)



export type Actions = loadSetting | changeBillDate
