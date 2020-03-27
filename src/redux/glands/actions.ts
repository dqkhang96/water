
import {IGland} from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_GLANDS="LOAD_GLANDS",
    ADD_GLAND="ADD_GLAND",
    DELETE_GLAND="DELETE_GLAND"
}

export interface loadGlands { type: ActionTypes.LOAD_GLANDS, payload: IGland[] }
export const loadGlands = (glands: IGland[]) => action(ActionTypes.LOAD_GLANDS, glands)

export interface addGland { type: ActionTypes.ADD_GLAND, payload: IGland }
export const addGland = (gland: IGland) => action(ActionTypes.ADD_GLAND, gland)

export interface deleteGland { type: ActionTypes.DELETE_GLAND, payload: string }
export const deleteGland = (glandId: string) => action(ActionTypes.DELETE_GLAND, glandId)

export type Actions=loadGlands|addGland|deleteGland
