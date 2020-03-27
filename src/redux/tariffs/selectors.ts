import { AppState } from '..'
import { createSelector } from 'reselect'

const getTariffsState = ((state: AppState) => state.tariffs)

export const tariffs = createSelector([getTariffsState], s => {
    return s.items
})

