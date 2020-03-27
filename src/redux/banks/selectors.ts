import { AppState } from '..'
import { createSelector } from 'reselect'

const getBanksState = ((state: AppState) => state.banks)

export const banks = createSelector([getBanksState], s => {
    return s.items
})

