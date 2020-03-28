import { AppState } from '..'
import { createSelector } from 'reselect'

const getScreenState = ((state: AppState) => state.screen)

export const screen = createSelector([getScreenState], s => {
    return s.item
})

