import React, { Component, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { HeadCell } from './EnhancedTable'
import { Types } from '@/utils/types';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { tariffs } from '@/redux/tariffs/selectors'
import { banks } from '@/redux/banks/selectors'
import { glands } from '@/redux/glands/selectors'
import { ITariff } from '@/redux/tariffs/types'
import { IBank } from '@/redux/banks/types'
import { IGland } from '@/redux/glands/types'

import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { stringToDate, dateToString } from '@/utils';
import { AppState } from '@/redux';
import { connect } from 'react-redux';



const mapStateToProps = (state: AppState) => ({
    tariffs: tariffs(state),
    banks: banks(state),
    glands: glands(state)
})

interface PropsFromState {
    tariffs: ITariff[]
    banks: IBank[]
    glands: IGland[]
}

interface SelfProps {
    classes?: any
    headCell: HeadCell
    value: any
    onChange: (value: any) => void
}

type Props = SelfProps & PropsFromState

const InputDynamic = ({ headCell, value, onChange, classes, tariffs, banks, glands }: Props) => {
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
            case Types.BANK: return (banks) ? (banks) : []
            case Types.TARIFF: return (tariffs) ? (tariffs) : []
            case Types.GLAND: return (glands) ? (glands) : []
            default: return []
        }
    }
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
                    value={stringToDate("dd-MM-yyyy", value)}
                    open={open}
                    onClick={() => setOpen(true)}
                    onChange={(date: Date) => {
                        onChange(dateToString("dd-MM-yyyy", date))
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
        case Types.GLAND:
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
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {getOptions().map(option => (
                        <MenuItem value={option._id} key={option._id}>
                            <em>{option.name}</em>
                        </MenuItem>
                    ))}
                </Select>
            )
        default: return <p>{value}</p>


    }
}


export default connect(mapStateToProps)(InputDynamic)