
import { ISetting } from './types'
import { Actions, ActionTypes } from './actions'


export interface State {
    item: ISetting
}


export const initState: State = {
    item: {
        dateBill: 25,
        companyAddress: "Số 16 tòa nhà TNR đương Nguyễn Chí Thanh, quận Đống Đa, Hà Nội",
        companyTaxCode: "123456789",
        companyName: "Công ty DevSamurai Việt Nam",
        companyPhoneNumber: "0987654321",
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
