import { AppState } from '..'
import { createSelector } from 'reselect'
import { ICustomer } from './types'

const getCustomersState = ((state: AppState) => state.customers)

export const customers = createSelector([getCustomersState], s => {
    return s.items
})

