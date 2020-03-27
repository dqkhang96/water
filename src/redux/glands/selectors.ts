import { AppState } from '..'
import { createSelector } from 'reselect'

const getGlandsState = ((state: AppState) => state.customers)

export const glands = createSelector([getGlandsState], s => {
    return s.items
})

