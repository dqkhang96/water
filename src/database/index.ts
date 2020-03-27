import Datastore from 'nedb'
import { ICustomer } from '@/redux/customers/types'
import { IBill } from '@/redux/bills/types'

export const customer=new Datastore<ICustomer>('customer.duongbinh')
export const bill=new Datastore<IBill>('bill.duongbinh')

const db={
    customer,
    bill
}
export default db