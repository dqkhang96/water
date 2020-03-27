import * as fromBills from './bills/reducer'
import * as fromCustomers from './customers/reducer'
import * as fromGlands from './glands/reducer'
import * as fromBanks from './banks/reducer'
import * as fromTariffs from './tariffs/reducer'
import { combineReducers } from 'redux';

import {Actions as BillsActions } from './bills/actions'
import {Actions as CustomersActions} from './customers/actions'
import {Actions as BanksActions} from './banks/actions'
import {Actions as GlandsActions} from './glands/actions'
import {Actions as TariffsActions} from './tariffs/actions'

import { createStore } from 'redux'

export interface AppState {
    bills: fromBills.State
    customers:fromCustomers.State
    grands:fromGlands.State
    banks:fromBanks.State
    tariffs:fromTariffs.State
}

export const reducer = () => combineReducers<AppState>({
    bills:fromBills.reducer,
    customers:fromCustomers.reducer,
    grands:fromGlands.reducer,
    banks:fromBanks.reducer,
    tariffs:fromTariffs.reducer
})


export const configureStore = (
    initialState?: any,
) => {
    const enhancer = (window as any)["__REDUX_DEVTOOLS_EXTENSION__"] ? (window as any)["__REDUX_DEVTOOLS_EXTENSION__"]()(createStore) : createStore;
    // noinspection UnnecessaryLocalVariableJS
    return enhancer(
        reducer(),
        initialState,
    )
}


export type Actions=BillsActions|CustomersActions|BanksActions|GlandsActions|TariffsActions
export const store = configureStore()