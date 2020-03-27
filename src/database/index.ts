import Datastore from 'nedb'
import { ICustomer } from '@/redux/customers/types'
import { IBill } from '@/redux/bills/types'

export const customer = new Datastore<ICustomer>('stores/customer.duongbinh')
customer.loadDatabase(err => err && console.log(err))
export const bill = new Datastore<IBill>('stores/bill.duongbinh')
bill.loadDatabase(err => err && console.log(err))

const db = {
    customer,
    bill
}
export default db