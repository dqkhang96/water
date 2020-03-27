import React, { Component, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { HeadCell } from './EnhancedTable'
import { Types } from '@/utils/types';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format'


import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { stringToDate, dateToString } from '@/utils';

interface SelfProps {
    headCell: HeadCell
    value: any
    onChange: (value: any) => void
}

type Props = SelfProps

function InputDynamic({ headCell, value, onChange }: Props) {
    var [openPicker, setOpen] = useState(false)
    var [currentValue, setValue] = useState(value)

    switch (headCell.type) {
        case Types.NUMBER:
            return <NumberFormat onValueChange={(values) =>
                setValue(values.floatValue)
            } value={currentValue}
                onBlur={() => onChange(currentValue)}
                customInput={TextField}
                thousandSeparator
                isNumericString
                thousandsGroupStyle='thousand'
            />
        case Types.STRING:
            return <TextField onChange={(event) =>
                setValue(event.target.value)
            } value={currentValue} type="text"
                onBlur={() =>
                    onChange(currentValue)} />
        case Types.DATETIME:
            return (
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd-MM-yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={stringToDate("dd-MM-yyyy", value)}
                    open={openPicker}
                    onClick={() => setOpen(true)}
                    onChange={(date: Date) => {
                        onChange(dateToString("dd-MM-yyyy", date))
                        setOpen(false)
                    }}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            )
        case Types.BOOLEAN: {
            return <Checkbox checked={value} onChange={(event) => onChange(event.target.checked)} />
        }
        default: return <p>{value}</p>


    }
}

export default InputDynamic