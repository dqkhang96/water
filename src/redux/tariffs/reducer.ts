import {ITariff} from './types'
import {Actions, ActionTypes} from './actions'


export interface State {
    items: ITariff[]
}


export const  initState:State ={
    items:[]
} 

export function reducer(state: State = initState, action: Actions)  {
    switch (action.type) {
        case ActionTypes.LOAD_TARIFFS:{
            return {
                ...state,
                items:action.payload
            }
        }
        case ActionTypes.ADD_TARIFF:{
            return {
                ...state,
                items:[...state.items,action.payload]
            }
        }
        case ActionTypes.DELETE_TARIFF:{
            var newItems=[...state.items]
            newItems=newItems.filter((item)=>item._id!==action.payload)
            return {
                ...state,
                items:newItems
            }
        }
        default: return state
    }
}
