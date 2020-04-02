import React, { Component, useState, useEffect } from 'react'
import { HeadCell, Row } from './EnhancedTable'
import { Types, TableTypes } from '@/utils/types';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { tariffs } from '@/redux/tariffs/selectors'
import { banks } from '@/redux/banks/selectors'
import { glands } from '@/redux/glands/selectors'
import { createMuiTheme } from '@material-ui/core/styles'
import { ITariff, TypeOfPrice, RangePrice } from '@/redux/tariffs/types'
import { IBank } from '@/redux/banks/types'
import { IGland } from '@/redux/glands/types'
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider'
import { Tooltip, IconButton, TextField, ThemeProvider } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteIcon from '@material-ui/icons/Delete';


import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { stringToDate, dateToString } from '@/utils';
import { AppState } from '@/redux';
import { connect } from 'react-redux';
import { changeTypes } from '@/redux/bills/selectors';
import { CustomerType } from '@/redux/customers/types';


const theme = createMuiTheme()


const mapStateToProps = (state: AppState) => ({
    tariffs: tariffs(state),
    banks: banks(state),
    glands: glands(state)
})

interface PropsFromState {
    tariffs: ITariff[]
    banks: IBank[]
    glands: IGland[]
    row: Row
}

interface SelfProps {
    classes?: any
    headCell: HeadCell
    value: any
    onChange: (value: any) => void
    tableType: TableTypes
}

interface Option {
    _id: string
    name: string
    default?: boolean
}

type Props = SelfProps & PropsFromState

const InputDynamic = ({ headCell, value, onChange, classes, tariffs, banks, glands, tableType, row }: Props) => {
    var [open, setOpen] = useState(false)
    var [currentValue, setValue] = useState(value)
    var [focus, setFocus] = useState(false)
    const onBlur = () => {
        onChange(currentValue)
        setFocus(false)
    }
    const onFocus = () => {
        setValue(value)
        setFocus(true)
    }

    const onKeyPress = (event: React.KeyboardEvent<any>) => {
        if (event.charCode === 13) {
            onChange(currentValue)
        }
    }

    const getOptions = () => {
        switch (headCell.type) {
            case Types.TARIFF: return (tariffs) ? (tariffs) : []
            case Types.BANK: return (banks) ? (banks) : []
            case Types.GLAND: return (glands) ? (glands) : []
            default: return []
        }
    }
    const options: Option[] = getOptions()

    useEffect(() => {
        if ((!value) && (options.length > 0) && (headCell.notNull)) {
            var indexOption = options.findIndex(option => option.default)
            if (indexOption === -1)
                indexOption = 0
            onChange(value ? value : options[indexOption]._id)
        }
    })

    if (tableType === TableTypes.TARIFF)
        if ((row.typeOfPrice === TypeOfPrice.DIVISION) && (["unit", "tax", "total"].findIndex((prop) => prop === headCell.propertyName) > -1))
            return null;
        else
            if ((row.typeOfPrice === TypeOfPrice.FIXED) && (headCell.propertyName === "rangePrices"))
                return null;
    const getInput = () => {
        switch (headCell.type) {
            case Types.NUMBER:
                return <NumberFormat disabled={headCell.disableEditor} onValueChange={(values) =>
                    setValue(values.floatValue)
                } value={!focus ? value : currentValue}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyPress={onKeyPress}
                    customInput={TextField}
                    thousandSeparator
                    isNumericString
                    thousandsGroupStyle='thousand'
                    className={classes}

                />
            case Types.STRING:
                return <TextField disabled={headCell.disableEditor} onChange={(event) =>
                    setValue(event.target.value)
                } type="text"
                    value={!focus ? value : currentValue}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onKeyPress={onKeyPress}
                    className={classes}
                />
            case Types.DATETIME:
                return (
                    <KeyboardDatePicker
                        disabled={headCell.disableEditor}
                        disableToolbar
                        variant="inline"
                        format="dd-MM-yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={value}
                        open={open && !headCell.disableEditor}
                        onClick={() => setOpen(true)}
                        onChange={(date: Date) => {
                            onChange(date)
                            setOpen(false)
                        }}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        className={classes}

                    />
                )
            case Types.BOOLEAN: {
                return <Checkbox checked={value} onChange={(event) => onChange(event.target.checked)} />
            }
            case Types.TARIFF:
            case Types.CHARGE_TYPE:
            case Types.PAY_TYPE:
            case Types.BANK:
            case Types.GLAND: {
                return (
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        value={value}
                        onChange={(event) => {
                            setOpen(false)
                            onChange(event.target.value)
                        }}
                        onClick={() => setOpen(!open)}
                        className={classes}
                    >
                        {!headCell.notNull && <MenuItem value="">
                            <em>None</em>
                        </MenuItem>}
                        {options.map(option => (
                            <MenuItem value={option._id} key={option._id}>
                                <em>{option.name}</em>
                            </MenuItem>
                        ))}
                    </Select>
                )
            }
            case Types.TYPE_OF_PRICE: {
                return (
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        value={value}
                        onChange={(event) => {
                            setOpen(false)
                            onChange(event.target.value)
                        }}
                        onClick={() => setOpen(!open)}
                        className={classes}
                    >
                        {[{ _id: TypeOfPrice.FIXED, name: "Tĩnh" }, { _id: TypeOfPrice.DIVISION, name: "Luỹ tuyến" }].map(option => (
                            <MenuItem value={option._id} key={option._id}>
                                <em>{option.name}</em>
                            </MenuItem>
                        ))}
                    </Select>
                )
            }
            case Types.CUSTOMER_TYPE: {
                return (
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        value={value}
                        onChange={(event) => {
                            setOpen(false)
                            onChange(event.target.value)
                        }}
                        onClick={() => setOpen(!open)}
                        className={classes}
                    >
                        {[{ _id: CustomerType.ENTERPRISE, name: "Doanh nghiệp" }, { _id: CustomerType.PERSONAL, name: "Cá nhân" }].map(option => (
                            <MenuItem value={option._id} key={option._id}>
                                <em>{option.name}</em>
                            </MenuItem>
                        ))}
                    </Select>
                )
            }
            case Types.RANGE_PRICES: {

                if (!value)
                    value = []
                return (
                    <Box marginTop={1} >
                        {value.map((rangePrice: RangePrice, index: number, rangePrices: RangePrice[]) => (
                            <Box key={index} position="relative" border={1} borderRadius={3} borderColor="#ededed" padding={1} marginBottom={index === rangePrices.length - 1 ? 0 : 1}>
                                <NumberFormat disabled={headCell.disableEditor} onValueChange={(values) => {
                                    const newRangePrices = [...rangePrices]
                                    newRangePrices[index] = {
                                        to: values.floatValue ? values.floatValue : 0,
                                        unit: newRangePrices[index].unit
                                    }
                                    setValue(newRangePrices)
                                }}
                                    placeholder="Mức sử dụng nước"
                                    value={!focus ? rangePrice.to : currentValue.to}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onKeyPress={onKeyPress}
                                    customInput={TextField}
                                    thousandSeparator
                                    isNumericString
                                    suffix=" m3"
                                    thousandsGroupStyle='thousand'
                                    className={classes}
                                />
                                <NumberFormat disabled={headCell.disableEditor} onValueChange={(values) => {
                                    const newRangePrices = [...rangePrices]
                                    newRangePrices[index] = {
                                        to: newRangePrices[index].to,
                                        unit: values.floatValue ? values.floatValue : 0
                                    }
                                    setValue(newRangePrices)
                                }}
                                    placeholder="Đơn giá"
                                    value={!focus ? rangePrice.unit : currentValue.unit}
                                    onBlur={onBlur}
                                    onFocus={onFocus}
                                    onKeyPress={onKeyPress}
                                    customInput={TextField}
                                    thousandSeparator
                                    isNumericString
                                    suffix=" VND"
                                    thousandsGroupStyle='thousand'
                                    className={classes}

                                />
                                <Box position="absolute" right={1} top={1}>
                                    <Tooltip title="Xoá giá">
                                        <IconButton size="small" aria-label="delete" onClick={() => {
                                            value.splice(index, 1)
                                            onChange(value)
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        ))}
                        <Tooltip title="Thêm khoảng">
                            <IconButton aria-label="Add" size="small" onClick={() => {
                                onChange([...value, { to: null, unit: null }])
                            }}>
                                <AddBoxIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                )
            }
            default: return <p>{value}</p>
        }

    }

    return getInput()
}


export default connect(mapStateToProps)(InputDynamic)