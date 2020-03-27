
import {IBank} from './types'
import { action } from 'typesafe-actions'
export enum ActionTypes {

    LOAD_BANKS="LOAD_BANKS",
    ADD_BANK="ADD_BANK",
    DELETE_BANK="DELETE_BANK",
}


export interface loadBanks { type: ActionTypes.LOAD_BANKS, payload: IBank[] }
export const loadBanks = (banks: IBank[]) => action(ActionTypes.LOAD_BANKS, banks)

export interface addBank { type: ActionTypes.ADD_BANK, payload: IBank }
export const addBank = (bank: IBank) => action(ActionTypes.ADD_BANK, bank)

export interface deleteBank { type: ActionTypes.DELETE_BANK, payload: string }
export const deleteBank = (bankId: string) => action(ActionTypes.DELETE_BANK, bankId)


export type Actions=loadBanks|addBank|deleteBank