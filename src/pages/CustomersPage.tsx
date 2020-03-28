import React, { Component } from 'react'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable';
import { customers } from '@/redux/customers/selectors'
import { updateCustomerProperty, loadCustomers, deleteCustomer } from '@/redux/customers/actions'
import { Types } from '@/utils/types';
import { ICustomer } from '@/redux/customers/types';
import { addCustomer } from '@/redux/customers/actions'
import { AppState } from '@/redux';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid'
import { customer } from '@/database'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'

const headCells: HeadCell[] = [{
    propertyName: "code",
    type: Types.STRING,
    disableEditor: false,
    disablePadding: false,
    label: "Mã khách hàng"
},
{
    propertyName: "name",
    type: Types.STRING,
    disableEditor: false,
    label: "Tên khách hàng",
    disablePadding: false,
},
{
    propertyName: "address",
    type: Types.STRING,
    disableEditor: false,
    label: "Địa chỉ",
    disablePadding: false,
},
{
    propertyName: "tariffId",
    type: Types.TARIFF,
    isArray: true,
    disableEditor: false,
    label: "Bảng giá",
    disablePadding: false,
},
{
    propertyName: "glandId",
    type: Types.GLAND,
    isArray: true,
    disableEditor: false,
    label: "Tuyến",
    disablePadding: false,
},
{
    propertyName: "waterMeterCode",
    type: Types.STRING,
    disableEditor: false,
    label: "Mã đồng hồ",
    disablePadding: false,
},
{
    propertyName: "numberOfHouseholds",
    type: Types.NUMBER,
    disableEditor: false,
    label: "Số hộ",
    disablePadding: false,
},
{
    propertyName: "numberOfPeople",
    type: Types.NUMBER,
    disableEditor: false,
    label: "Số nhân khẩu",
    disablePadding: false,
},
{
    propertyName: "phoneNumber",
    type: Types.STRING,
    disableEditor: false,
    label: "Số điện thoại",
    disablePadding: false,
},
{
    propertyName: "taxCode",
    type: Types.STRING,
    disableEditor: false,
    label: "Mã số thuế",
    disablePadding: false,
},
{
    propertyName: "email",
    type: Types.STRING,
    disableEditor: false,
    label: "Địa chỉ email",
    disablePadding: false,
},
{
    propertyName: "contractCode",
    type: Types.STRING,
    disableEditor: false,
    label: "Số hợp đồng",
    disablePadding: false,
},
{
    propertyName: "contractDate",
    type: Types.DATETIME,
    disableEditor: false,
    label: "Ngày hợp đồng",
    disablePadding: false,
},
{
    propertyName: "environmentalProtectionFee",
    type: Types.NUMBER,
    disableEditor: false,
    label: "Phí BVMT",
    disablePadding: false,
},
{
    propertyName: "chargeTypeId",
    type: Types.CHARGE_TYPE,
    disableEditor: false,
    label: "Cách tính phí",
    disablePadding: false,
},
{
    propertyName: "payTypeId",
    type: Types.PAY_TYPE,
    disableEditor: false,
    label: "HT thanh toán",
    disablePadding: false,
},
{
    propertyName: "bankId",
    type: Types.BANK,
    disableEditor: false,
    label: "Ngân hàng",
    disablePadding: false,
},
{
    propertyName: "beginUse",
    type: Types.DATETIME,
    disableEditor: false,
    label: "Ngày bắt đầu sd",
    disablePadding: false,
},
{
    propertyName: "endUse",
    type: Types.DATETIME,
    disableEditor: false,
    label: "Ngày ngưng sd",
    disablePadding: false,
},
{
    propertyName: "active",
    type: Types.BOOLEAN,
    disableEditor: false,
    label: "Kich hoặt",
    disablePadding: false,
}]

const mapDispatchToProps = {
    addCustomer,
    updateCustomerProperty,
    loadCustomers,
    deleteCustomer
}

const mapStateToProps = (state: AppState) => ({
    customers: customers(state),
    screen: screen(state)
})

interface SelfProps {

}

interface PropsFromDispatch {
    addCustomer: typeof addCustomer
    updateCustomerProperty: typeof updateCustomerProperty
    loadCustomers: typeof loadCustomers
    deleteCustomer: typeof deleteCustomer
}

interface PropsFromState {
    customers: ICustomer[]
    screen: IScreen
}

type Props = SelfProps & PropsFromState & PropsFromDispatch

const newCustomer = {
    _id: uuid4(),
    code: "NO",
    name: "Đinh Quang Khang",
    waterMeterCode: "T-A/0001",
    address: "Nam Định",
    tariffId: "",
    glandId: "",
    numberOfHouseholds: 1,
    numberOfPeople: 1,
    phoneNumber: "0828100296",
    taxCode: "Ngon",
    email: "dqkhang96@gmail.com",
    contractCode: "MK_00",
    contractDate: "",
    chargeTypeId: "",
    payTypeId: "",
    environmentalProtectionFee: 10,
    bankId: "",
    beginUse: "",
    endUse: "",
    active: true
}

class CustomersPage extends Component<Props>{
    constructor(props: Props) {
        super(props)
        this.addCustomer = this.addCustomer.bind(this)
        this.updateCustomerProperty = this.updateCustomerProperty.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
    }

    componentDidMount() {

    }

    addCustomer() {
        customer.insert({ ...newCustomer, _id: uuid4() }, (err, customer) => {
            if (err)
                console.log(err)
            else
                this.props.addCustomer(customer)
        })
    }

    deleteRows(ids: string[]) {
        this.props.deleteCustomer(ids)
        customer.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} customer(s)!`)
        })
    }

    updateCustomerProperty(id: string, property: string, value: any) {
        this.props.updateCustomerProperty(id, property, value)
        var newData: { [key: string]: any } = {}
        newData[property] = value
        customer.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
            if (err)
                console.log(err)
            else console.log(`Update ${numReplaced} customer(s)!`)
        })
    }

    render() {
        const { customers, screen } = this.props
        return (
            <EnhancedTable
                screen={screen}
                headCells={headCells}
                updateProperty={this.updateCustomerProperty}
                deleteRows={this.deleteRows}
                rows={customers as Row[]}
                title="Quản lý khách hàng"
                addRow={this.addCustomer}
            />

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage)