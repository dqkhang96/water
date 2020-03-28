
import { IScreen } from './types'
import { Actions, ActionTypes } from './actions'


export interface State {
    item: IScreen
}


export const initState: State = {
    item: {
        height: window.innerHeight,
        width: window.innerWidth
    }
}

export function reducer(state: State = initState, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOAD_SCREEN: {
            return {
                ...state,
                item: action.payload
            }
        }
        default: return state
    }
}
