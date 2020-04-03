import React, { Component } from 'react'
import { addPayType, deletePayType, updatePayTypeProperty } from '@/redux/bills/actions'
import { payTypes } from '@/redux/bills/selectors'
import { IPayType } from '@/redux/bills/types'
import { AppState } from '@/redux'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable'
import { Types, TableTypes } from '@/utils/types'
import { connect } from 'react-redux'
import { payType } from '@/database'
import { v4 as uuid4 } from 'uuid'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { WIDTH_SEARCH_BAR } from '@/utils/constant'
import Chip from '@material-ui/core/Chip';
import lodash from 'lodash'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SearchOption } from '@/utils/types'


const headCells: HeadCell[] = [
    {
        propertyName: "index",
        type: Types.NUMBER,
        disableEditor: true,
        disablePadding: false,
        label: "STT",
        width: 80
    },
    {
        propertyName: "code",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Mã phương thức",
        width: 100
    }, {
        propertyName: "name",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Tên phương thức",
        width: 250
    },
    {
        propertyName: "default",
        type: Types.BOOLEAN,
        disableEditor: false,
        disablePadding: false,
        label: "Mặc định",
        width: 80
    },
    {
        propertyName: "active",
        type: Types.BOOLEAN,
        disableEditor: false,
        disablePadding: false,
        label: "Kích hoạt",
        width: 80
    }
]



interface PropsFromDispatch {
    addPayType: typeof addPayType
    deletePayType: typeof deletePayType
    updatePayTypeProperty: typeof updatePayTypeProperty
}
const mapDispatchToProps = {
    addPayType, deletePayType, updatePayTypeProperty
}


interface PropsFromState {
    payTypes: IPayType[]
    screen: IScreen
}

const mapStateToProps = (state: AppState) => ({
    payTypes: payTypes(state),
    screen: screen(state)
})

interface SelfProps {

}

type Props = SelfProps & PropsFromState & PropsFromDispatch


const newPayType: IPayType = {
    _id: uuid4(),
    code: "NEW",
    name: "Phương thức thanh toán",
    default:false,
    active: true
}

interface State {
    selected: string[]
    searchOptions: SearchOption[]
    searchOptionSelecteds: SearchOption[]
}

class PayTypePage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: [],
            searchOptions: [],
            searchOptionSelecteds: []
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.addGland = this.addGland.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.loadSearchOptions = this.loadSearchOptions.bind(this)
    }

    componentDidMount() {
        this.loadSearchOptions()
    }

    loadSearchOptions(props?: Props) {
        const { payTypes } = props ? props : this.props
        var searchOptions: SearchOption[] = []
        const properties: string[] = ["code", "name"]
        properties.forEach((property: string) => {
            var pros: SearchOption[] = payTypes.map((gland: any) => {
                return {
                    property,
                    id: gland._id,
                    key: gland[property]
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


    onSelect(ids: string[]) {
        this.setState({ selected: ids })
    }

    addGland() {
        payType.insert({ ...newPayType, _id: uuid4() }, (err, newPayType) => {
            if (err)
                console.log(err)
            else
                this.props.addPayType(newPayType)
        })
    }

    deleteRows() {
        const { remote } = require('electron')
        let options = {
            buttons: ["Không", "Có"],
            message: "Bạn muốn xoá tuyến?"
        }
        if (remote.dialog.showMessageBox(options) === 0)
            return;
        const ids = this.state.selected
        this.props.deletePayType(ids)
        this.setState({ selected: [] })
        payType.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} pay type(s)!`)
        })
    }

    updateProperty(id: string, property: string, value: any) {
        var newData: { [key: string]: any } = {}

        this.props.updatePayTypeProperty(id, property, value)

        if ((property === "default")) {
            payType.update({ $not: { _id: id } }, { $set: { default: false } }, { multi: true }, (err, numReplaced) => {
            })
            this.props.payTypes.forEach((payType) => payType._id !== id && this.props.updatePayTypeProperty(payType._id, property, false))
        }
        
        newData[property] = value
        payType.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
            if (err)
                console.log(err)
            else console.log(`Update ${numReplaced} pay type(s)!`)
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
                        <TextField {...params} label="Từ khoá" variant="standard" placeholder="Tìm tuyến" />
                    )}
                    onChange={(event, searchOptionSelecteds: SearchOption[]) => {
                        this.setState({ searchOptionSelecteds })
                    }}
                />
            </Tooltip>)
    }

    render() {
        var { payTypes, screen } = this.props
        const { searchOptionSelecteds } = this.state
        var payTypeShows = payTypes.filter((gland: any) => {
            var ok = true
            const groupOptions = lodash.groupBy(searchOptionSelecteds, "property")
            for (let key in groupOptions) {
                ok = !!(groupOptions[key].find((option: SearchOption) => option.key === gland[key]))
                if (!ok) break;
            }
            return ok
        })

        payTypeShows = payTypeShows.map((payType, index) => ({ ...payType, index }))
        return (
            <EnhancedTable screen={screen}
                tableType={TableTypes.PAY_TYPE}
                selectToolbarColor="rgba(241, 14, 124, 0.3)"
                selectCellColor="rgba(241, 14, 124, 0.1)"
                headCells={headCells}
                selected={this.state.selected}
                onSelect={this.onSelect}
                selectControl={(<Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => this.deleteRows()}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>)}
                defaultControl={(<React.Fragment>
                    {this.searchBar()}
                    <Tooltip title="Add">
                        <IconButton aria-label="Add" onClick={this.addGland}>
                            <AddBoxIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
                )}
                updateProperty={this.updateProperty}

                rows={payTypeShows as Row[]}
                title="Phương thức thanh toán"

            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PayTypePage)