import React, { Component } from 'react'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable';
import { customers } from '@/redux/customers/selectors'
import { updateCustomerProperty, loadCustomers, deleteCustomer } from '@/redux/customers/actions'
import { Types, TableTypes } from '@/utils/types';
import { ICustomer, CustomerType } from '@/redux/customers/types';
import { addCustomer } from '@/redux/customers/actions'
import { AppState } from '@/redux';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid'
import { customer } from '@/database'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { WIDTH_SEARCH_BAR } from '@/utils/constant';
import { glands } from '@/redux/glands/selectors'
import { IGland } from '@/redux/glands/types'
import Chip from '@material-ui/core/Chip';
import lodash from 'lodash'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SearchOption } from '@/utils/types'

const headCells: HeadCell[] = [{
    propertyName: "code",
    type: Types.STRING,
    disableEditor: false,
    disablePadding: false,
    label: "Mã khách hàng"
},
{
    propertyName: "customerType",
    type: Types.CUSTOMER_TYPE,
    disableEditor: false,
    label: "Loại khách hàng",
    disablePadding: false,
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
    propertyName: "owner",
    type: Types.STRING,
    disableEditor: false,
    label: "Chủ sở hữu",
    disablePadding: false,
},
{
    propertyName: "rentAddress",
    type: Types.STRING,
    disableEditor: false,
    label: "Địa chỉ thuê",
    disablePadding: false,
},
{
    propertyName: "tariffId",
    notNull: true,
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
// {
//     propertyName: "chargeTypeId",
//     type: Types.CHARGE_TYPE,
//     disableEditor: false,
//     label: "Cách tính phí",
//     disablePadding: false,
// },
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
    screen: screen(state),
    glands: glands(state)
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
    glands: IGland[]
}

type Props = SelfProps & PropsFromState & PropsFromDispatch

const newCustomer = {
    _id: uuid4(),
    code: "NEW",
    name: "",
    waterMeterCode: "T-A/0001",
    address: "",
    tariffId: "",
    glandId: "",
    numberOfHouseholds: 1,
    numberOfPeople: 1,
    phoneNumber: "0123456789",
    taxCode: "123456789",
    email: "example@gmail.com",
    contractCode: "MK_00",
    contractDate: null,
    chargeTypeId: "",
    payTypeId: "",
    rentAddress: "",
    owner: "",
    customerType: CustomerType.ENTERPRISE,
    environmentalProtectionFee: 10,
    bankId: "",
    beginUse: null,
    endUse: null,
    active: true
}

interface State {
    selected: string[]
    searchOptions: SearchOption[]
    searchOptionSelecteds: SearchOption[]
}
class CustomersPage extends Component<Props, State>{
    constructor(props: Props) {
        super(props)
        this.state = {
            selected: [],
            searchOptions: [],
            searchOptionSelecteds: []
        }
        this.addCustomer = this.addCustomer.bind(this)
        this.updateCustomerProperty = this.updateCustomerProperty.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.loadSearchOptions = this.loadSearchOptions.bind(this)
    }

    componentDidMount() {
        this.loadSearchOptions()
    }

    loadSearchOptions(props?: Props) {
        const { customers, glands } = props ? props : this.props
        var searchOptions: SearchOption[] = []
        searchOptions = searchOptions.concat([{ key: "Doanh nghiệp", id: CustomerType.ENTERPRISE, property: "customerType" }, { key: "Cá nhân", id: CustomerType.PERSONAL, property: "customerType" }])
        const properties: string[] = ["code", "name", "address", "owner", "rentAddress", "glandId"]
        properties.forEach((property: string) => {
            var pros: SearchOption[] = customers.map((customer: any) => {
                if (property === "glandId") {
                    const gland = glands.find((gland) => gland._id === customer.glandId)

                    return {
                        property,
                        id: gland ? gland._id : null,
                        key: gland ? gland.name : null
                    }
                }
                else
                    return {
                        property,
                        id: customer._id,
                        key: customer[property]
                    }

            })
            var newProps: SearchOption[] = []
            pros.forEach((pr: SearchOption) => {
                if ((pr.key !== null) && (newProps.findIndex((npr) => npr.key === pr.key) === -1))
                    newProps.push(pr)
            })
            searchOptions = searchOptions.concat(newProps)
        })

        this.setState({ searchOptions })
    }

    addCustomer() {
        customer.insert({ ...newCustomer, _id: uuid4() }, (err, customer) => {
            if (err)
                console.log(err)
            else
                this.props.addCustomer(customer)
        })
    }

    deleteRows() {
        const ids = this.state.selected
        this.props.deleteCustomer(ids)
        this.setState({ selected: [] })
        customer.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} customer(s)!`)
        })
    }

    updateCustomerProperty(id: string, property: string, value: any) {
        const cus = this.props.customers.find((customer) => customer._id === id)
        if (!cus)
            return;
        this.props.updateCustomerProperty(id, property, value)
        var newData: { [key: string]: any } = {}
        newData[property] = value
        if ((property === "name") || (property === "address") && (cus.customerType === CustomerType.PERSONAL)) {
            if (!cus.owner) {
                this.props.updateCustomerProperty(id, "owner", cus.name)
                newData.owner = cus.name
            }
            if (!cus.rentAddress) {
                this.props.updateCustomerProperty(id, "rentAddress", cus.address)
                newData.rentAddress = cus.address
            }
        }
        customer.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
            if (err)
                console.log(err)
            else console.log(`Update ${numReplaced} customer(s)!`)
        })
    }

    onSelect(ids: string[]) {
        this.setState({ selected: ids })
    }

    searchBar() {
        const { searchOptions } = this.state
        return (
            <Tooltip title="Search">
                <Autocomplete
                    multiple
                    id="tags-standard"
                    options={searchOptions}
                    getOptionLabel={(option) => option.key}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip label={option.key} {...getTagProps({ index })} />
                        ))
                    }
                    filterSelectedOptions
                    style={{ width: WIDTH_SEARCH_BAR }}
                    renderInput={(params) => (
                        <TextField {...params} label="Từ khoá" variant="standard" placeholder="Tìm hoá đơn" />
                    )}
                    onChange={(event, searchOptionSelecteds: SearchOption[]) => {
                        this.setState({ searchOptionSelecteds })
                    }}
                />
            </Tooltip>)
    }

    render() {
        const { customers, screen } = this.props
        const { searchOptionSelecteds } = this.state
        var customersShow = customers.filter((customer: any) => {
            var ok = true
            const groupOptions = lodash.groupBy(searchOptionSelecteds, "property")
            for (let key in groupOptions) {
                if (key === "glandId")
                    ok = !!groupOptions.glandId.find((option: SearchOption) => option.id === customer.glandId)
                if (key === "customerType")
                    ok = groupOptions.customerType.findIndex((option: SearchOption) => option.id === customer.customerType) > -1
                else
                    ok = !!(groupOptions[key].find((option: SearchOption) => option.key === customer[key]))
                if (!ok) break;
            }
            return ok
        })
        return (
            <EnhancedTable
                tableType={TableTypes.CUSTOMER}
                selectToolbarColor="rgba(241, 14, 124, 0.3)"
                selectCellColor="rgba(241, 14, 124, 0.1)"
                selected={this.state.selected}
                onSelect={this.onSelect}
                selectControl={(<Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={this.deleteRows}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>)}
                defaultControl={(<React.Fragment>
                    {this.searchBar()}
                    <Tooltip title="Add">
                        <IconButton aria-label="Add" onClick={this.addCustomer}>
                            <AddBoxIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>

                )}
                screen={screen}
                headCells={headCells}
                updateProperty={this.updateCustomerProperty}
                rows={customersShow as Row[]}
                title="Quản lý khách hàng"
            />

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersPage)