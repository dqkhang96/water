import Datastore from 'nedb'
import { ICustomer } from '@/redux/customers/types'
import { IBill } from '@/redux/bills/types'
import { ITariff } from '@/redux/tariffs/types'
import { IGland } from '@/redux/glands/types'

export const customer = new Datastore<ICustomer>('stores/customer.duongbinh')
customer.loadDatabase(err => err && console.log(err))

export const bill = new Datastore<IBill>('stores/bill.duongbinh')
bill.loadDatabase(err => err && console.log(err))

export const tariff = new Datastore<ITariff>('stores/tariff.duongbinh')
tariff.loadDatabase(err => err && console.log(err))

export const gland = new Datastore<IGland>('stores/gland.duongbinh')
gland.loadDatabase(err => err && console.log(err))

const db = {
    customer,
    bill,
    gland
}
export default db