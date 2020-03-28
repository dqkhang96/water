
import { ITariff } from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_TARIFFS = "LOAD_TARIFFS",
    ADD_TARIFF = "ADD_TARIFF",
    DELETE_TARIFF = "DELETE_TARIFF",
    UPDATE_TARIFF_PROPERTY = "UPDATE_TARIFF_PROPERTY"
}

export interface loadTariffs { type: ActionTypes.LOAD_TARIFFS, payload: ITariff[] }
export const loadTariffs = (tariffs: ITariff[]) => action(ActionTypes.LOAD_TARIFFS, tariffs)

export interface addTariff { type: ActionTypes.ADD_TARIFF, payload: ITariff }
export const addTariff = (tariff: ITariff) => action(ActionTypes.ADD_TARIFF, tariff)

export interface deleteTariff { type: ActionTypes.DELETE_TARIFF, payload: string | string[] }
export const deleteTariff = (tariffId: string | string[]) => action(ActionTypes.DELETE_TARIFF, tariffId)

export interface updateTariffProperty { type: ActionTypes.UPDATE_TARIFF_PROPERTY, payload: { _id: string, property: string, value: any } }
export const updateTariffProperty = (id: string, property: string, value: any) => action(ActionTypes.UPDATE_TARIFF_PROPERTY, { _id: id, property, value })

export type Actions = loadTariffs | addTariff | deleteTariff | updateTariffProperty
