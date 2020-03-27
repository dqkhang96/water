import {ICustomer} from './types'
import {Actions, ActionTypes} from './actions'


export interface State {
    items: ICustomer[]
}


export const  initState:State ={
    items:[]
} 

export function reducer(state: State = initState, action: Actions)  {
    switch (action.type) {
        case ActionTypes.LOAD_CUSTOMERS:{
            return {
                ...state,
                items:action.payload
            }
        }
        case ActionTypes.ADD_CUSTOMER:{
            return {
                ...state,
                items:[...state.items,action.payload]
            }
        }
        case ActionTypes.DELETE_CUSTOMER:{
            var newItems=[...state.items]
            newItems=newItems.filter((item)=>item._id!==action.payload)
            return {
                ...state,
                items:newItems
            }
        }
        case ActionTypes.UPDATE_CUSTOMER_PROPERTY:{
            var newItems=[...state.items]
            var indexItemChange:number=newItems.findIndex((item)=>item._id===action.payload._id)

            if(indexItemChange===-1)
                return state;
            (newItems[indexItemChange] as {[key:string]:any})[action.payload.property]=action.payload.value
            return {
                ...state,
                items:newItems
            }
        }
        default: return state
    }
}
