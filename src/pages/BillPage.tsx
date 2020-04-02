import React, { Component } from 'react'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable';
import { customers } from '@/redux/customers/selectors'
import { updateBillProperty } from '@/redux/bills/actions'
import { IBill, Bill } from '@/redux/bills/types'
import { IGland } from '@/redux/glands/types'
import { Types, TableTypes } from '@/utils/types';
import { ICustomer, CustomerType } from '@/redux/customers/types';
import { ITariff, RangePrice, TypeOfPrice } from '@/redux/tariffs/types';
import Chip from '@material-ui/core/Chip';
import { tariffs } from '@/redux/tariffs/selectors';
import { AppState } from '@/redux';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid'
import lodash from 'lodash'
import { customer } from '@/database'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { bill as billDb } from '@/database'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import * as fs from "fs";
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { glands } from '@/redux/glands/selectors'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Fab from '@material-ui/core/Fab';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { WIDTH_SEARCH_BAR } from '@/utils/constant';
import Button from '@material-ui/core/Button';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { docso, formatNumber, dateToString } from '@/utils';
import { SearchOption } from '@/utils/types'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const headCells: HeadCell[] = [
    {
        propertyName: "index",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        width: 30,
        label: "Thứ tự"
    },
    {
        propertyName: "customerCode",
        type: Types.STRING,
        disableEditor: true,
        disablePadding: false,
        width: 70,
        label: "Mã khách hàng"
    },
    {
        propertyName: "customerName",
        type: Types.STRING,
        disableEditor: true,
        disablePadding: false,
        label: "Tên khách hàng"
    },
    {
        propertyName: "customerAddress",
        type: Types.STRING,
        disableEditor: true,
        disablePadding: false,
        width: 300,
        label: "Địa chỉ"
    },
    {
        propertyName: "waterMeterCode",
        type: Types.STRING,
        width: 90,
        disableEditor: true,
        disablePadding: false,
        label: "Mã ĐH"
    },
    {
        propertyName: "numberBegin",
        type: Types.NUMBER,
        width: 100,
        disableEditor: false,
        disablePadding: false,
        label: "CS đầu kì"
    },
    {
        propertyName: "numberEnd",
        type: Types.NUMBER,
        width: 100,
        disableEditor: false,
        disablePadding: false,
        label: "CS cuối kì"
    },
    {
        propertyName: "consume",
        type: Types.NUMBER,
        width: 100,
        disableEditor: true,
        disablePadding: false,
        label: "Tiêu thụ"
    },
    {
        propertyName: "tariffId",
        type: Types.TARIFF,
        disableEditor: false,
        notNull: true,
        disablePadding: false,
        label: "Bảng giá hiện tại"
    },
    {
        propertyName: "beforeTax",
        type: Types.NUMBER,
        width: 180,
        disableEditor: true,
        disablePadding: false,
        label: "Trước thuế"
    },
    {
        propertyName: "tax",
        type: Types.NUMBER,
        width: 180,
        disableEditor: true,
        disablePadding: false,
        label: "Thuế giá trị gia tăng"
    },
    {
        propertyName: "feeNumber",
        type: Types.NUMBER,
        width: 180,
        disableEditor: false,
        disablePadding: false,
        label: "Mức phí BVMT"
    },
    {
        propertyName: "fee",
        type: Types.NUMBER,
        width: 180,
        disableEditor: true,
        disablePadding: false,
        label: "Phí bảo vệ môi trường"
    },
    {
        propertyName: "total",
        width: 180,
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Tổng tiền"
    },
    {
        propertyName: "payed",
        type: Types.NUMBER,
        width: 180,
        disableEditor: false,
        disablePadding: false,
        label: "Đã T.Toán"
    },
    {
        propertyName: "datePay",
        type: Types.DATETIME,
        disableEditor: true,
        disablePadding: false,
        label: "Ngày TT"
    },
    // {
    //     propertyName: "payTypeId",
    //     type: Types.PAY_TYPE,
    //     disableEditor: true,
    //     disablePadding: false,
    //     label: "HT T.Toán"
    // },
    {
        propertyName: "rest",
        width: 180,
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Còn lại"
    },
    {
        propertyName: "glandId",
        type: Types.GLAND,
        width: 150,
        disableEditor: false,
        disablePadding: false,
        label: "Tuyến"
    },
    // {
    //     propertyName: "period",
    //     type: Types.NUMBER,
    //     disableEditor: false,
    //     disablePadding: false,
    //     label: "Số kì"
    // },
    // {
    //     propertyName: "numberOfHouseholds",
    //     type: Types.NUMBER,
    //     disableEditor: false,
    //     disablePadding: false,
    //     label: "Số hộ"
    // },
    // {
    //     propertyName: "numberOfPeople",
    //     type: Types.NUMBER,
    //     disableEditor: false,
    //     disablePadding: false,
    //     label: "Số NK"
    // },

    {
        propertyName: "numberBill",
        type: Types.NUMBER,
        width: 70,
        disableEditor: false,
        disablePadding: false,
        label: "Số hoá đơn"
    },
    {
        propertyName: "dateBill",
        type: Types.DATETIME,
        disableEditor: false,
        disablePadding: false,
        label: "Ngày hoá đơn"
    },
    // {
    //     propertyName: "fromDate",
    //     type: Types.DATETIME,
    //     disableEditor: true,
    //     disablePadding: false,
    //     label: "Từ ngày"
    // },
    // {
    //     propertyName: "toDate",
    //     type: Types.DATETIME,
    //     disableEditor: true,
    //     disablePadding: false,
    //     label: "Đến ngày"
    // },
    {
        propertyName: "numberPrint",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Số lần in"
    },
    {
        propertyName: "note",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Ghi chú"
    }
]


const mapDispatchToProps = {

}

const mapStateToProps = (state: AppState) => ({
    customers: customers(state),
    screen: screen(state),
    tariffs: tariffs(state),
    glands: glands(state)
})

interface SelfProps {

}

interface PropsFromDispatch {

}

interface PropsFromState {
    customers: ICustomer[]
    tariffs: ITariff[]
    screen: IScreen
    glands: IGland[]
}

type Props = SelfProps & PropsFromState & PropsFromDispatch

enum SaveStatus {
    NONE,
    SUCCESS,
    FAIL
}
interface State {
    selected: string[]
    showBills: Bill[]
    bills: Bill[]
    fromDate: Date
    toDate: Date
    searchOptions: SearchOption[]
    searchOptionSeleceds: SearchOption[]
    openSaveDoc: boolean
    saveStatus: SaveStatus

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        changeTime: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "between",
            marginRight: 50
        },
        changeTimeLabel: {
            padding: theme.spacing(1),
            margin: theme.spacing(2),
            width: 80,
            textAlign: "center",
            fontWeight: "bold"
        }
    }),
);

interface RangerTime {
    fromDate: Date, toDate: Date
}
interface ChangeTimeProps {
    rangerTime: RangerTime,
    changeRangerDate: (rangerDate: RangerTime) => void
}

const ChangeTime = ({ rangerTime, changeRangerDate }: ChangeTimeProps) => {
    const classes = useStyles();
    const { fromDate, toDate } = rangerTime


    return (
        <div className={classes.changeTime}>
            <Fab size="small" color="primary" aria-label="pre" onClick={() => {
                var date = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1);
                changeRangerDate({
                    fromDate: new Date(date.getFullYear(), date.getMonth(), 1),
                    toDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                })
            }}>
                <FastRewindIcon fontSize="small" />
            </Fab>
            <Typography className={classes.changeTimeLabel} variant="inherit">
                {`${rangerTime.fromDate.getMonth() + 1} - ${rangerTime.fromDate.getFullYear()}`}
            </Typography>
            <Fab size="small" color="primary" aria-label="next" onClick={() => {
                var date = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1);

                changeRangerDate({
                    fromDate: new Date(date.getFullYear(), date.getMonth(), 1),
                    toDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                })
            }}>
                <FastForwardIcon fontSize="small" />
            </Fab>
        </div>
    )

}

class BillPage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        var date = new Date();
        this.state = {
            selected: [],
            bills: [],
            searchOptions: [],
            searchOptionSeleceds: [],
            fromDate: new Date(date.getFullYear(), date.getMonth(), 1),
            toDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
            showBills: [],
            saveStatus: SaveStatus.NONE,
            openSaveDoc: false
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.delete = this.delete.bind(this)
        this.loadData = this.loadData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.updateBill = this.updateBill.bind(this)
        this.searchBar = this.searchBar.bind(this)
        this.printBills = this.printBills.bind(this)
    }

    componentWillReceiveProps(nextProps: Props) {
        const { glands, customers } = nextProps
        if ((customers.length > 0))
            this.loadData(nextProps)
    }

    loadData(props?: Props) {
        const { fromDate, toDate } = this.state
        const { customers, glands } = props ? props : this.props
        const that = this
        billDb.find({}).sort({ numberBill: -1 }).limit(1).exec(function (err, docs) {
            var maxNumberBill: number
            if (docs.length > 0)
                maxNumberBill = docs[0].numberBill + 1

            const lastFromDate = new Date(fromDate.getTime()), lastToDate = new Date(toDate.getTime())
            lastFromDate.setMonth(lastFromDate.getMonth() - 1)
            lastToDate.setMonth(lastToDate.getMonth() - 1)
            billDb.find({ $and: [{ dateBill: { $gte: lastFromDate } }, { dateBill: { $lte: lastToDate } }] }).exec((err, lastBills) => {
                billDb.find({ $and: [{ dateBill: { $gte: fromDate } }, { dateBill: { $lte: toDate } }] }).exec((err, bills) => {

                    const newBills: Bill[] = customers.map((customer, index) => {
                        const bill: Bill | undefined = bills.find((doc) => doc.customerId === customer._id)
                        const lastBill: Bill | undefined = lastBills.find((doc) => doc.customerId === customer._id)
                        if (bill)
                            return {
                                ...bill,
                                isStored: true,
                                index: index + 1
                            }
                        maxNumberBill += 1
                        const newBill: Bill = {
                            _id: uuid4(),
                            taxCode: customer.taxCode,
                            index: index + 1,
                            customerCode: customer.code,
                            customerId: customer._id,
                            customerName: customer.name,
                            customerAddress: customer.address,
                            waterMeterCode: customer.waterMeterCode,
                            tariffId: customer.tariffId,
                            glandId: customer.glandId,
                            period: 1,
                            numberBegin: lastBill ? lastBill.numberEnd : null,
                            numberOfHouseholds: customer.numberOfHouseholds,
                            numberOfPeople: customer.numberOfPeople,
                            feeNumber: 10,
                            numberBill: maxNumberBill,
                            dateBill: fromDate,
                            datePay: null,
                            fromDate,
                            toDate,
                            numberPrint: 0,
                            isStored: false,
                            historyPay: []
                        }
                        return newBill
                    })
                    var searchOptions: SearchOption[] = []
                    const properties: string[] = ["customerName", "glandId", "customerAddress", "customerCode"]
                    properties.forEach((property: string) => {
                        var pros: SearchOption[] = newBills.map((bill: Bill) => {
                            if (property === "glandId") {
                                const gland = glands.find((gland) => gland._id === bill.glandId)

                                return {
                                    property,
                                    id: gland ? gland._id : null,
                                    key: gland ? gland.name : null
                                }
                            }
                            else
                                return {
                                    property,
                                    id: bill.customerId,
                                    key: property === "customerName" ? bill.customerName : property === "customerAddress" ? bill.customerAddress : bill.customerCode
                                }

                        })
                        var newProps: SearchOption[] = []
                        pros.forEach((pr: SearchOption) => {
                            if ((pr.key !== null) && (newProps.findIndex((npr) => npr.key === pr.key) === -1))
                                newProps.push(pr)
                        })
                        searchOptions = searchOptions.concat(newProps)
                    })
                    that.setState({ searchOptions, bills: newBills, showBills: newBills, selected: newBills.map((bill) => bill._id) })
                })
            })


        });

    }

    componentDidMount() {
        this.loadData(this.props)
    }



    delete() {
        const ids = this.state.selected
        const { fromDate, toDate, bills } = this.state

        billDb.remove({ $and: [{ dateBill: { $gte: fromDate } }, { dateBill: { $lte: toDate } }, { _id: { $in: ids } }] }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} bill(s)!`)
        })

        const newBills = bills.map((bill: Bill) => {
            if (ids.indexOf(bill._id) === -1)
                return bill
            else return {
                ...bill,
                isStored: false,
                numberBegin: null,
                numberEnd: null,
                consume: null,
                beforeTax: null,
                tax: null,
                fee: null,
                total: null,
                payed: null,
                rest: null, datePay: null,
                historyPay: [],
                dateBill: fromDate,
                numberPrint: 0
            }
        })
        this.setState({ bills: newBills })
    }

    onSelect(ids: string[]) {
        this.setState({ selected: ids })
    }

    updateBill(lastId: string, bill: Bill) {
        const newBills = [...this.state.bills]
        const updateBillIndex = newBills.findIndex((fbill) => fbill._id === lastId)
        newBills[updateBillIndex] = bill
        billDb.update({ _id: lastId }, { $set: bill }, {}, (err, docs) => { })
        this.setState({ bills: newBills })
    }

    updateProperty(id: string, property: string, value: any) {
        const that = this
        const { tariffs } = this.props
        const { bills, fromDate } = this.state
        const updateBillProperty = (lastId: string, bill: any, property: string, value: any) => {
            if ((property === "numberBegin") || (property == "numberEnd") || (property === "tariffId") || (property === "feeNumber")) {
                bill[property] = value
                that.updateBill(lastId, bill)
            } else
                if (property === "payed") {
                    bill.payed = value
                    if ((bill.total) && (!value))
                        bill.payed = 0;
                    else {
                        const rest = bill.total - bill.payed
                        const datePay = new Date()
                        bill.rest = rest
                        bill.datePay = datePay
                        bill.historyPay.push({
                            payed: value,
                            datePay: datePay
                        })
                    }
                    that.updateBill(lastId, bill)
                } else {
                    bill[property] = value
                    that.updateBill(lastId, bill)
                }
        }

        const bill = bills.find(bill => bill._id === id)
        if (bill)
            if (bill.isStored) {
                updateBillProperty(id, bill, property, value)
            }
            else {
                bill.isStored = true
                bill.dateBill = fromDate
                billDb.insert(bill, (err, newBill) => {
                    updateBillProperty(id, newBill, property, value)
                })
            }

    }

    printBills() {
        const { selected, bills } = this.state
        const { customers } = this.props
        const billsPrinted = bills.filter((bill) => selected.indexOf(bill._id) > -1)
        const { remote } = require('electron')

        var pathFolder = remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        });

        var PizZip = require('pizzip')
        var Docxtemplater = require('docxtemplater')
        var path = require('path')
        //Or asynchronous - using callback

        this.setState({ openSaveDoc: true })
        var content = fs
            .readFileSync(path.join(__dirname, '/templates/bill_template.docx'), 'binary');

        var zip = new PizZip(content);
        var doc: any;
        try {
            doc = new Docxtemplater(zip);
        } catch (error) {
            // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
            console.log(error)
        }


        var numberFiles = billsPrinted.length
        billsPrinted.forEach((bill: Bill, index: number) => {
            const customer = customers.find((customer) => customer._id === bill.customerId)
            if (!customer)
                return;
            const dataDoc = {
                ...bill,
                dateBillToString: dateToString("#dd #MM #yyyy", bill.dateBill),
                rangeDate: ((bill.fromDate) && (bill.toDate)) ? `${dateToString("dd/MM/yyyy", bill.fromDate)}-${dateToString("dd/MM/yyyy", bill.toDate)}` : "",
                name: customer.name,
                address: customer.address,
                taxCode: customer.taxCode,
                rentAddress: customer.rentAddress,
                owner: customer.owner,
                isEnterprise: customer.customerType === CustomerType.ENTERPRISE,
                isPersonal: customer.customerType === CustomerType.PERSONAL,
                totalFormat: `${formatNumber(bill.total)}đ`,
                numberBeginFormat: formatNumber(bill.numberBegin),
                numberEndFormat: formatNumber(bill.numberEnd),
                consumeFormat: formatNumber(bill.consume),
                moneyToString: `${docso(bill.total)} đồng.`

            }
            //set the templateVariables
            doc.setData(dataDoc);

            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                this.setState({ saveStatus: SaveStatus.FAIL, openSaveDoc: false })
            }

            var buff = doc.getZip()
                .generate({ type: 'nodebuffer' });

            fs.writeFile(`${pathFolder}/(${index + 1})${dataDoc.name.replace(/[^\w\s]/gi, '')}-(${dateToString("dd-MM-yyyy", bill.dateBill)}).docx`, buff, (err) => {
                if (!err)
                    numberFiles--
                if (numberFiles === 0)
                    this.setState({ saveStatus: SaveStatus.SUCCESS, openSaveDoc: false })
            });

        })

    }

    searchBar() {
        const { searchOptions, bills } = this.state
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
                        this.setState({
                            showBills: bills.filter((bill: any) => {
                                var ok = true
                                const groupOptions = lodash.groupBy(searchOptionSelecteds, "property")
                                for (let key in groupOptions) {
                                    if (key === "glandId")
                                        ok = !!groupOptions.glandId.find((option: SearchOption) => option.id === bill.glandId)
                                    else
                                        ok = !!(groupOptions[key].find((option: SearchOption) => option.key === bill[key]))
                                    if (!ok) break;
                                }
                                return ok
                            })
                        })
                    }}
                />
            </Tooltip>)
    }

    render() {
        const { screen, tariffs } = this.props
        var { showBills, selected, fromDate, toDate, openSaveDoc, saveStatus } = this.state
        const bills = showBills.map((bill) => {
            const tariff = tariffs.find((tariff) => tariff._id === bill.tariffId)
            const numberBegin: number = bill.numberBegin
            const numberEnd: number = bill.numberEnd
            const feeNumber: number = bill.feeNumber

            if ((tariff) && (numberBegin) && (numberEnd) && (feeNumber)) {
                var rangePrices: RangePrice[] = tariff.rangePrices
                var typeOfPrice: TypeOfPrice = tariff.typeOfPrice
                bill.consume = numberEnd - numberBegin
                if (typeOfPrice === TypeOfPrice.FIXED) {
                    bill.beforeTax = Math.round(bill.consume * tariff.unit)
                } else {
                    var beforeTax = 0, i = 0
                    var consume = bill.consume
                    for (i = 0; i < rangePrices.length; i++)
                        if (consume > rangePrices[i].to) {
                            beforeTax += rangePrices[i].to * rangePrices[i].unit
                            consume -= rangePrices[i].to
                        } else break;
                    if (consume > 0)
                        beforeTax += consume * rangePrices[rangePrices.length - 1].unit
                    bill.beforeTax = beforeTax
                }
                bill.tax = Math.round(bill.beforeTax * tariff.taxPercel / 100)
                bill.fee = Math.round(bill.beforeTax * feeNumber / 100)
                bill.total = bill.beforeTax + bill.tax + bill.fee

                if (bill.payed)
                    bill.rest = bill.total - bill.payed
            }
            return bill
        })
        return (
            <div>
                <Snackbar open={openSaveDoc} autoHideDuration={2000} onClose={() => this.setState({ openSaveDoc: false })}>
                    <Alert severity="info">
                        Đang tạo hoá đơn
                    </Alert>
                </Snackbar>
                <Snackbar open={saveStatus !== SaveStatus.NONE} autoHideDuration={1500} onClose={() => this.setState({ saveStatus: SaveStatus.NONE })}>
                    <Alert severity={saveStatus === SaveStatus.SUCCESS ? "success" : saveStatus === SaveStatus.FAIL ? "error" : undefined}>
                        {SaveStatus.SUCCESS ? "Tạo hoá đơn thành công" : "Có lỗi trong quá trình tạo hoá đơn"}
                    </Alert>
                </Snackbar>
                <EnhancedTable
                    tableType={TableTypes.BILL}
                    selected={this.state.selected}
                    onSelect={this.onSelect}
                    selectToolbarColor="rgba(241, 14, 124, 0.02)"
                    selectCellColor="rgba(241, 14, 124, 0)"
                    screen={screen}
                    selectControl={(
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Button size="small" variant="contained" color="primary" style={{ width: 155, height: "100%", marginRight: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} onClick={this.printBills}>
                                <span>
                                    Xuất hoá đơn
                                </span >
                                <SaveAltIcon />
                            </Button>
                            <ChangeTime rangerTime={{ fromDate, toDate }} changeRangerDate={(range: RangerTime) => {
                                this.setState({ fromDate: range.fromDate, toDate: range.toDate }, this.loadData)
                            }} />
                            {this.searchBar()}
                            <Tooltip title={`Xoá ${selected.length} hoá đơn`}>
                                <IconButton aria-label="delete" onClick={this.delete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                    defaultControl={(
                        <React.Fragment>
                            <ChangeTime rangerTime={{ fromDate, toDate }} changeRangerDate={(range: RangerTime) => {
                                this.setState({ fromDate: range.fromDate, toDate: range.toDate }, this.loadData)
                            }} />
                            {this.searchBar()}
                        </React.Fragment>

                    )}
                    headCells={headCells}
                    updateProperty={this.updateProperty}
                    rows={bills as Row[]}
                    title="Hoá đơn"
                />
            </div>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillPage)

