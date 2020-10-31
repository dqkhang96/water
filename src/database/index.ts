import Datastore from 'nedb'
import { ICustomer } from '@/redux/customers/types'
import { Bill, IPayType } from '@/redux/bills/types'
import { ITariff } from '@/redux/tariffs/types'
import { IGland } from '@/redux/glands/types'
import { IBank } from '@/redux/banks/types'
import { ISetting } from '@/redux/setting/types'

export const customer = new Datastore<ICustomer>('stores/customer.db')
customer.loadDatabase(err => err && console.log(err))

export const bill = new Datastore<Bill>('stores/bill.db')
bill.loadDatabase(err => err && console.log(err))

export const tariff = new Datastore<ITariff>('stores/tariff.db')
tariff.loadDatabase(err => err && console.log(err))

export const gland = new Datastore<IGland>('stores/gland.db')
gland.loadDatabase(err => err && console.log(err))

export const bank = new Datastore<IBank>('stores/bank.db')
bank.loadDatabase(err => err && console.log(err))

export const setting = new Datastore<ISetting>('stores/setting.db')
setting.loadDatabase(err => err && console.log(err))

export const payType = new Datastore<IPayType>('stores/payType.db')
payType.loadDatabase(err => err && console.log(err))



const db = {
    customer,
    bill,
    gland,
    bank,
    setting
}
export default db