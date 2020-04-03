
import { ISetting } from './types'
import { Actions, ActionTypes } from './actions'


export interface State {
    item: ISetting
}


export const initState: State = {
    item: {
        dateBill: 25,
        companyAddress: "",
        companyTaxCode: "",
        companyName: "",
        companyPhoneNumber: "",
        _id: "none",
        timeUpdate: new Date()
    }
}

export function reducer(state: State = initState, action: Actions) {
    switch (action.type) {
        case ActionTypes.LOAD_SETTING: {
            return {
                ...state,
                item: action.payload
            }
        }
        case ActionTypes.CHANGE_BILL_DATE: {
            return {
                ...state,
                item: { ...state.item, dateBill: action.payload }
            }
        }
        default: return state
    }
}
