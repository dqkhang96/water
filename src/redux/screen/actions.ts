
import { IScreen } from './types'
import { action } from 'typesafe-actions'

export enum ActionTypes {
    LOAD_SCREEN = "LOAD_SCREEN",
}

export interface loadScreen { type: ActionTypes.LOAD_SCREEN, payload: IScreen }
export const loadScreen = (screen: IScreen) => action(ActionTypes.LOAD_SCREEN, screen)


export type Actions = loadScreen
