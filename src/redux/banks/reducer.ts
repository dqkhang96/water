import { IBank } from './types'
import { Actions, ActionTypes } from './actions'



export interface State {
    items: IBank[]
}


const initState: State = {
    items: [],

}

export function reducer(state: State = initState, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOAD_BANKS: {
            return {
                ...state,
                items: action.payload
            }
        }
        case ActionTypes.ADD_BANK: {
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        }
        case ActionTypes.DELETE_BANK: {
            var newItems = [...state.items]
            if (Array.isArray(action.payload))
                newItems = newItems.filter((item) => action.payload.indexOf(item._id) === -1)
            else
                newItems = newItems.filter((item) => item._id !== action.payload)
            return {
                ...state,
                items: newItems
            }
        }
        case ActionTypes.UPDATE_BANK_PROPERTY: {
            var newItems = [...state.items]
            var indexItemChange: number = newItems.findIndex((item) => item._id === action.payload._id)

            if (indexItemChange === -1)
                return state;
            (newItems[indexItemChange] as { [key: string]: any })[action.payload.property] = action.payload.value
            return {
                ...state,
                items: newItems
            }
        }
        default: return state
    }
}
