import { AppState } from '..'
import { createSelector } from 'reselect'

const getSettingState = ((state: AppState) => state.setting)

export const setting = createSelector([getSettingState], s => {
    return s.item
})

