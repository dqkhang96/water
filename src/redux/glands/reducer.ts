import {IGland} from './types'
import {Actions, ActionTypes} from './actions'


export interface State {
    items: IGland[]
}


export const  initState:State ={
    items:[]
} 

export function reducer(state: State = initState, action: Actions)  {
    switch (action.type) {
        case ActionTypes.LOAD_GLANDS:{
            return {
                ...state,
                items: action.payload
            }
        }
        case ActionTypes.ADD_GLAND:{
            return {
                ...state,
                items:[...state.items,action.payload]
            }
        }
        case ActionTypes.DELETE_GLAND:{
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
