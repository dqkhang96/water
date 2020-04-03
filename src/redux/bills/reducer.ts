import { IBill, IChargeType, IPayType } from './types'
import { Actions, ActionTypes } from './actions'


export interface State {
    items: IBill[]
    changeTypes: IChargeType[]
    payTypes: IPayType[]
}


const initState: State = {
    items: [],
    changeTypes: [],
    payTypes: []
}

export function reducer(state: State = initState, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOAD_BILLS: {
            return {
                ...state,
                items: action.payload
            }
        }
        case ActionTypes.ADD_BILL: {
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        }
        case ActionTypes.DELETE_BILL: {
            var newItems = [...state.items]
            newItems = newItems.filter((item) => item._id !== action.payload)
            return {
                ...state,
                items: newItems
            }
        }
        case ActionTypes.UPDATE_BILL_PROPERTY: {
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
        case ActionTypes.LOAD_CHANGE_TYPES: {
            return {
                ...state,
                changeTypes: action.payload
            }
        }
        case ActionTypes.ADD_CHANGE_TYPE: {
            return {
                ...state,
                changeTypes: [...state.changeTypes, action.payload]
            }
        }
        case ActionTypes.DELETE_CHANGE_TYPE: {
            var newChangeTypes = [...state.changeTypes]
            newChangeTypes = newChangeTypes.filter((item) => item._id !== action.payload)
            return {
                ...state,
                changeTypes: newChangeTypes
            }
        }
        case ActionTypes.LOAD_PAY_TYPES: {
            return {
                ...state,
                payTypes: action.payload
            }
        }
        case ActionTypes.ADD_PAY_TYPE: {
            return {
                ...state,
                payTypes: [...state.payTypes, action.payload]
            }
        }
        case ActionTypes.DELETE_PAY_TYPE: {
            var newPayTypes = [...state.payTypes]
            if (Array.isArray(action.payload))
                newPayTypes = newPayTypes.filter((item) => action.payload.indexOf(item._id) === -1)
            else
                newPayTypes = newPayTypes.filter((item) => item._id !== action.payload)
            return {
                ...state,
                payTypes: newPayTypes
            }
        }
        case ActionTypes.UPDATE_PAY_TYPE_PROPERTY: {
            var newPayTypes = [...state.payTypes]
            var indexItemChange: number = newPayTypes.findIndex((item) => item._id === action.payload._id)

            if (indexItemChange === -1)
                return state;
            (newPayTypes[indexItemChange] as { [key: string]: any })[action.payload.property] = action.payload.value
            return {
                ...state,
                payTypes: newPayTypes
            }
        }
        default: return state
    }
}
