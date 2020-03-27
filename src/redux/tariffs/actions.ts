
import {ITariff} from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_TARIFFS="LOAD_TARIFFS",
    ADD_TARIFF="ADD_TARIFF",
    DELETE_TARIFF="DELETE_TARIFF"
}

export interface loadTariffs { type: ActionTypes.LOAD_TARIFFS, payload: ITariff[] }
export const loadTariffs = (tariffs: ITariff[]) => action(ActionTypes.LOAD_TARIFFS, tariffs)

export interface addTariff { type: ActionTypes.ADD_TARIFF, payload: ITariff }
export const addTariff = (tariff: ITariff) => action(ActionTypes.ADD_TARIFF, tariff)

export interface deleteTariff { type: ActionTypes.DELETE_TARIFF, payload: string }
export const deleteTariff = (tariffId: string) => action(ActionTypes.DELETE_TARIFF, tariffId)

export type Actions=loadTariffs|addTariff|deleteTariff
