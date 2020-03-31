import React, { Component } from 'react'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable';
import { customers } from '@/redux/customers/selectors'
import { updateBillProperty } from '@/redux/bills/actions'
import { IBill, Bill } from '@/redux/bills/types'
import { Types } from '@/utils/types';
import { ICustomer } from '@/redux/customers/types';
import { ITariff } from '@/redux/tariffs/types';
import { tariffs } from '@/redux/tariffs/selectors';
import { AppState } from '@/redux';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid'
import { customer } from '@/database'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { bill as billDb } from '@/database'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { bills } from '@/redux/bills/selectors';
import { dateToString } from '@/utils';
import Fab from '@material-ui/core/Fab';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';


const headCells: HeadCell[] = [
    {
        propertyName: "index",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Thứ tự"
    },
    {
        propertyName: "customerCode",
        type: Types.STRING,
        disableEditor: true,
        disablePadding: false,
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
        label: "Địa chỉ"
    },
    {
        propertyName: "waterMeterCode",
        type: Types.STRING,
        disableEditor: true,
        disablePadding: false,
        label: "Mã ĐH"
    },
    {
        propertyName: "numberBegin",
        type: Types.NUMBER,
        disableEditor: false,
        disablePadding: false,
        label: "CS đầu kì"
    },
    {
        propertyName: "numberEnd",
        type: Types.NUMBER,
        disableEditor: false,
        disablePadding: false,
        label: "CS cuối kì"
    },
    {
        propertyName: "consume",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Tiêu thụ"
    },
    {
        propertyName: "beforeTax",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Trước thuế"
    },
    {
        propertyName: "tax",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Thuế"
    },
    {
        propertyName: "fee",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Phí"
    },
    {
        propertyName: "total",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Tổng tiền"
    },
    {
        propertyName: "payed",
        type: Types.NUMBER,
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
    {
        propertyName: "payTypeId",
        type: Types.PAY_TYPE,
        disableEditor: true,
        disablePadding: false,
        label: "HT T.Toán"
    },
    {
        propertyName: "rest",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "Còn lại"
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
        propertyName: "glandId",
        type: Types.GLAND,
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
        propertyName: "feeNumber",
        type: Types.NUMBER,
        disableEditor: false,
        disablePadding: false,
        label: "Mức phí"
    },
    {
        propertyName: "numberBill",
        type: Types.NUMBER,
        disableEditor: false,
        disablePadding: false,
        label: "Số hoá đơn"
    },
    {
        propertyName: "dateBill",
        type: Types.DATETIME,
        disableEditor: true,
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
        label: "Đến ngày"
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
    tariffs: tariffs(state)
})

interface SelfProps {

}

interface PropsFromDispatch {

}

interface PropsFromState {
    customers: ICustomer[]
    tariffs: ITariff[]
    screen: IScreen
}

type Props = SelfProps & PropsFromState & PropsFromDispatch


interface State {
    selected: string[]
    bills: Bill[]
    fromDate: Date
    toDate: Date

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
                {`${rangerTime.fromDate.getMonth()+1} - ${rangerTime.fromDate.getFullYear()}`}
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
            fromDate: new Date(date.getFullYear(), date.getMonth(), 1),
            toDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.delete = this.delete.bind(this)
        this.loadData = this.loadData.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.updateBill = this.updateBill.bind(this)

    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.customers.length)
            this.loadData()
    }

    loadData() {
        const { fromDate, toDate } = this.state
        const { customers } = this.props
        const that = this
        billDb.find({}).sort({ numbe: 1 }).limit(1).exec(function (err, docs) {
            var maxNumberBill: number
            if (docs.length > 0)
                maxNumberBill = docs[0].numberBill

            billDb.find({ $and: [{ dateBill: { $gte: fromDate } }, { dateBill: { $lte: toDate } }] }).exec((err, docs) => {

                const newBills: Bill[] = customers.map((customer, index) => {
                    const bill: Bill | undefined = docs.find((doc) => doc.customerId === customer._id)

                    if (bill)
                        return {
                            ...bill,
                            isStored: true,
                            index
                        }
                    maxNumberBill += 1
                    const newBill: Bill = {
                        _id: uuid4(),
                        index,
                        customerCode: customer.code,
                        customerId: customer._id,
                        customerName: customer.name,
                        customerAddress: customer.address,
                        waterMeterCode: customer.waterMeterCode,
                        tariffId: customer.tariffId,
                        glandId: customer.glandId,
                        period: 1,
                        numberOfHouseholds: customer.numberOfHouseholds,
                        numberOfPeople: customer.numberOfPeople,
                        feeNumber: 10,
                        numberBill: maxNumberBill,
                        dateBill: null,
                        datePay: null,
                        fromDate,
                        toDate,
                        numberPrint: 0,
                        isStored: false,
                        historyPay: []
                    }
                    return newBill
                })
                that.setState({ bills: newBills, selected: newBills.map((bill) => bill._id) })
            })
        });

    }

    componentDidMount() {
        this.loadData()
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
                const tariff = tariffs.find((tariff) => tariff._id === bill.tariffId)
                const numberBegin: number = bill.numberBegin
                const numberEnd: number = bill.numberEnd
                const feeNumber: number = bill.feeNumber
                if ((tariff) && (numberBegin) && (numberEnd) && (feeNumber)) {
                    bill.consume = numberEnd - numberBegin
                    bill.beforeTax = Math.round(bill.consume * tariff.unit)
                    bill.tax = Math.round(bill.consume * tariff.tax)
                    bill.fee = Math.round(bill.beforeTax * feeNumber / 100)
                    bill.total = bill.beforeTax + bill.tax + bill.fee
                    if (bill.payed)
                        bill.rest = bill.total - bill.payed
                }
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


    render() {
        const { screen } = this.props
        const { bills, selected, fromDate, toDate } = this.state
        return (
            <EnhancedTable
                selected={this.state.selected}
                onSelect={this.onSelect}
                selectToolbarColor="rgba(241, 14, 124, 0.02)"
                selectCellColor="rgba(241, 14, 124, 0)"
                screen={screen}
                selectControl={(
                    <React.Fragment>
                        <ChangeTime rangerTime={{ fromDate, toDate }} changeRangerDate={(range: RangerTime) => {
                            this.setState({ fromDate: range.fromDate, toDate: range.toDate }, this.loadData)
                        }} />
                        <Tooltip title={`Xoá ${selected.length} hoá đơn`}>
                            <IconButton aria-label="delete" onClick={this.delete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                )}

                defaultControl={(
                    <React.Fragment>
                        <Tooltip title="Search">
                            <TextField id="standard-basic" label="Search" />
                        </Tooltip>
                    </React.Fragment>

                )}
                headCells={headCells}
                updateProperty={this.updateProperty}
                rows={bills as Row[]}
                title="Hoá đơn"
            />

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillPage)