
import { IGland } from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_GLANDS = "LOAD_GLANDS",
    ADD_GLAND = "ADD_GLAND",
    DELETE_GLAND = "DELETE_GLAND",
    UPDATE_GLAND_PROPERTY = "UPDATE_GLAND_PROPERTY"
}

export interface loadGlands { type: ActionTypes.LOAD_GLANDS, payload: IGland[] }
export const loadGlands = (glands: IGland[]) => action(ActionTypes.LOAD_GLANDS, glands)

export interface addGland { type: ActionTypes.ADD_GLAND, payload: IGland }
export const addGland = (gland: IGland) => action(ActionTypes.ADD_GLAND, gland)

export interface deleteGland { type: ActionTypes.DELETE_GLAND, payload: string | string[] }
export const deleteGland = (glandId: string | string[]) => action(ActionTypes.DELETE_GLAND, glandId)

export interface updateGlandProperty { type: ActionTypes.UPDATE_GLAND_PROPERTY, payload: { _id: string, property: string, value: any } }
export const updateGlandProperty = (id: string, property: string, value: any) => action(ActionTypes.UPDATE_GLAND_PROPERTY, { _id: id, property, value })


export type Actions = loadGlands | addGland | deleteGland | updateGlandProperty
