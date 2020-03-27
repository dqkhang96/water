import { AppState } from '..'
import { createSelector } from 'reselect'

const getBillsState = ((state: AppState) => state.bills)

export const bills = createSelector([getBillsState], s => {
    return s.items
})

export const changeTypes=createSelector([getBillsState], s => {
    return s.changeTypes
})

export const payTypes=createSelector([getBillsState], s => {
    return s.payTypes
})


