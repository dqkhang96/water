import React, { Component } from 'react'
import { addBank, deleteBank, updateBankProperty } from '@/redux/banks/actions'
import { banks } from '@/redux/banks/selectors'
import { IBank } from '@/redux/banks/types'
import { AppState } from '@/redux'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable'
import { Types, TableTypes } from '@/utils/types'
import { connect } from 'react-redux'
import { bank } from '@/database'
import { v4 as uuid4 } from 'uuid'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Chip from '@material-ui/core/Chip';
import lodash from 'lodash'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SearchOption } from '@/utils/types'
import { WIDTH_SEARCH_BAR } from '@/utils/constant'

const headCells: HeadCell[] = [
    {
        propertyName: "code",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Kí hiệu"
    },
    {
        propertyName: "name",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Tên ngân hàng"
    },
    {
        propertyName: "address",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Địa chỉ"
    },
    {
        propertyName: "phoneNumber",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Điện thoại"
    },
    {
        propertyName: "note",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Ghi chủ"
    },
    {
        propertyName: "active",
        type: Types.BOOLEAN,
        disableEditor: false,
        disablePadding: false,
        label: "Kích hoạt"
    }
]



interface PropsFromDispatch {
    addBank: typeof addBank
    deleteBank: typeof deleteBank
    updateBankProperty: typeof updateBankProperty
}
const mapDispatchToProps = {
    addBank,
    deleteBank,
    updateBankProperty
}


interface PropsFromState {
    banks: IBank[]
    screen: IScreen
}

const mapStateToProps = (state: AppState) => ({
    banks: banks(state),
    screen: screen(state)
})

interface SelfProps {

}

type Props = SelfProps & PropsFromState & PropsFromDispatch

interface State {
    selected: string[]
    searchOptions: SearchOption[]
    searchOptionSelecteds: SearchOption[]
}

const newBank: IBank = {
    _id: uuid4(),
    code: "NEW",
    name: "Ngân hàng ",
    address: "",
    note: "",
    phoneNumber: "",
    active: true
}
class BankPage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: [],
            searchOptions: [],
            searchOptionSelecteds: []
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.addBank = this.addBank.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.loadSearchOptions = this.loadSearchOptions.bind(this)
    }

    componentDidMount() {
        this.loadSearchOptions()
    }

    loadSearchOptions(props?: Props) {
        const { banks } = props ? props : this.props
        var searchOptions: SearchOption[] = []
        const properties: string[] = ["code", "name", "address"]
        properties.forEach((property: string) => {
            var pros: SearchOption[] = banks.map((bank: any) => {
                return {
                    property,
                    id: bank._id,
                    key: bank[property]
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

    addBank() {
        bank.insert({ ...newBank, _id: uuid4() }, (err, newBank) => {
            if (err)
                console.log(err)
            else
                this.props.addBank(newBank)
        })
    }

    onSelect(ids: string[]) {
        this.setState({ selected: ids })
    }

    deleteRows() {
        const ids = this.state.selected
        this.props.deleteBank(ids)
        this.setState({ selected: [] })
        bank.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} bank(s)!`)
        })
    }

    updateProperty(id: string, property: string, value: any) {
        var newData: { [key: string]: any } = {}

        this.props.updateBankProperty(id, property, value)

        newData[property] = value
        bank.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
            if (err)
                console.log(err)
            else console.log(`Update ${numReplaced} bank(s)!`)
        })
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
                        <TextField {...params} label="Từ khoá" variant="standard" placeholder="Tìm ngân hàng" />
                    )}
                    onChange={(event, searchOptionSelecteds: SearchOption[]) => {
                        this.setState({ searchOptionSelecteds })
                    }}
                />
            </Tooltip>)
    }


    render() {
        var { banks, screen } = this.props
        const { searchOptionSelecteds } = this.state
        var bankShows = banks.filter((bank: any) => {
            var ok = true
            const groupOptions = lodash.groupBy(searchOptionSelecteds, "property")
            for (let key in groupOptions) {
                ok = !!(groupOptions[key].find((option: SearchOption) => option.key === bank[key]))
                if (!ok) break;
            }
            return ok
        })
        return (
            <EnhancedTable
                tableType={TableTypes.BANK}
                screen={screen}
                selectToolbarColor="rgba(241, 14, 124, 0.3)"
                selectCellColor="rgba(241, 14, 124, 0.1)"
                headCells={headCells}
                selected={this.state.selected}
                onSelect={this.onSelect}
                selectControl={(
                    <Tooltip title="Xoá ngân hàng">
                        <IconButton aria-label="delete" onClick={this.deleteRows}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
                defaultControl={(<React.Fragment>
                    {this.searchBar()}
                    <Tooltip title="Add">
                        <IconButton aria-label="Add" onClick={this.addBank}>
                            <AddBoxIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>

                )}
                updateProperty={this.updateProperty}

                rows={bankShows as Row[]}
                title="Bảng giá"

            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BankPage)