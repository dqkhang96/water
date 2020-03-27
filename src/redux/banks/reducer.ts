import {IBank} from './types'
import {Actions, ActionTypes} from './actions'



export interface State {
    items: IBank[]
}


const initState:State ={
    items:[],
 
} 

export function reducer(state: State = initState, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOAD_BANKS:{
            return {
                ...state,
                items:action.payload
            }
        }
        case ActionTypes.ADD_BANK:{
            return {
                ...state,
                items:[...state.items,action.payload]
            }
        }
        case ActionTypes.DELETE_BANK:{
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
