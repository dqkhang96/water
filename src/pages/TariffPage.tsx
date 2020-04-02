import React, { Component } from 'react'
import { addTariff, deleteTariff, loadTariffs, updateTariffProperty } from '@/redux/tariffs/actions'
import { tariffs } from '@/redux/tariffs/selectors'
import { ITariff, TypeOfPrice, RangePrice } from '@/redux/tariffs/types'
import { AppState } from '@/redux'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable'
import { Types, TableTypes } from '@/utils/types'
import { connect } from 'react-redux'
import { tariff } from '@/database'
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

const headCells: HeadCell[] = [{
    propertyName: "name",
    type: Types.STRING,
    disableEditor: false,
    disablePadding: false,
    label: "Tên bảng giá"
},
{
    propertyName: "code",
    type: Types.STRING,
    disableEditor: false,
    disablePadding: false,
    label: "Tên viết tắt"
},
{
    propertyName: "typeOfPrice",
    type: Types.TYPE_OF_PRICE,
    disableEditor: false,
    disablePadding: false,
    label: "Cách tính phí"
},
{
    propertyName: "rangePrices",
    type: Types.RANGE_PRICES,
    width: 400,
    hide: true,
    disableEditor: false,
    disablePadding: false,
    label: "Bảng luỹ tuyến"
},
{
    propertyName: "unit",
    type: Types.NUMBER,
    disableEditor: false,
    disablePadding: false,
    label: "Đơn giá"
},
{
    propertyName: "taxPercel",
    type: Types.NUMBER,
    disableEditor: false,
    disablePadding: false,
    label: "Thuế(%)"
},
{
    propertyName: "tax",
    type: Types.NUMBER,
    disableEditor: true,
    disablePadding: false,
    label: "Tiền thuế"
},
{
    propertyName: "total",
    type: Types.NUMBER,
    disableEditor: true,
    disablePadding: false,
    label: "Tổng tiền"
},
{
    propertyName: "default",
    type: Types.BOOLEAN,
    disableEditor: false,
    disablePadding: false,
    label: "Mặc định"
},
{
    propertyName: "active",
    type: Types.BOOLEAN,
    disableEditor: false,
    disablePadding: false,
    label: "Đang sử dụng"
},
]

interface PropsFromDispatch {
    addTariff: typeof addTariff
    deleteTariff: typeof deleteTariff
    loadTariffs: typeof loadTariffs
    updateTariffProperty: typeof updateTariffProperty
}
const mapDispatchToProps = {
    addTariff,
    deleteTariff,
    loadTariffs,
    updateTariffProperty
}


interface PropsFromState {
    tariffs: ITariff[]
    screen: IScreen
}

const mapStateToProps = (state: AppState) => ({
    tariffs: tariffs(state),
    screen: screen(state)
})

interface SelfProps {

}

type Props = SelfProps & PropsFromState & PropsFromDispatch

interface State {
    selected: string[]
    headCells: HeadCell[]
    searchOptions: SearchOption[]
    searchOptionSelecteds: SearchOption[]
}

const newTariff: ITariff = {
    _id: uuid4(),
    code: "NEW",
    name: "Bảng giá mới",
    unit: 0,
    taxPercel: 10,
    tax: 0,
    total: 0,
    typeOfPrice: TypeOfPrice.FIXED,
    rangePrices: [],
    active: true,
    default: false
}
class TariffPage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: [],
            headCells: [...headCells],
            searchOptions: [],
            searchOptionSelecteds: []
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.addTariff = this.addTariff.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.searchBar = this.searchBar.bind(this)
        this.loadSearchOptions = this.loadSearchOptions.bind(this)
    }



    componentDidMount() {
        this.loadSearchOptions()
    }

    loadSearchOptions(props?: Props) {
        const { tariffs } = props ? props : this.props
        var searchOptions: SearchOption[] = []
        searchOptions = searchOptions.concat([{ key: "Luỹ tuyến", id: TypeOfPrice.DIVISION, property: "typeOfPrice" }, { key: "Tĩnh", id: TypeOfPrice.FIXED, property: "typeOfPrice" }])
        const properties: string[] = ["code", "name"]
        properties.forEach((property: string) => {
            var pros: SearchOption[] = tariffs.map((tariff: any) => {
                return {
                    property,
                    id: tariff._id,
                    key: tariff[property]
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

    addTariff() {
        tariff.insert({ ...newTariff, _id: uuid4() }, (err, newTariff) => {
            if (err)
                console.log(err)
            else
                this.props.addTariff(newTariff)
        })
    }

    onSelect(ids: string[]) {
        this.setState({ selected: ids })
    }

    deleteRows() {
        const { remote } = require('electron')
        let options = {
            buttons: ["Không", "Có"],
            message: "Bạn muốn xoá bảng giá?"
        }
        if (remote.dialog.showMessageBox(options) === 0)
            return;
        const ids = this.state.selected
        this.props.deleteTariff(ids)
        this.setState({ selected: [] })
        tariff.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} tariff(s)!`)
        })
    }


    updateProperty(id: string, property: string, value: any) {
        var newHeadCells = [...this.state.headCells]
        var newData: { [key: string]: any } = {}
        if ((property === 'unit') || (property == 'taxPercel')) {
            const tariff = this.props.tariffs.find(tariff => tariff._id === id)
            if (tariff) {
                const taxPercel = (property === 'taxPercel' ? value : tariff.taxPercel)
                const unit = (property === 'unit' ? value : tariff.unit)
                const tax = Math.round(unit * taxPercel / 100)
                const total = Math.round(unit * (taxPercel / 100 + 1))
                this.props.updateTariffProperty(id, 'tax', tax)
                this.props.updateTariffProperty(id, 'total', total)
                newData['tax'] = tax
                newData['total'] = total
            }
        }
        if ((property === "default")) {
            tariff.update({ $not: { _id: id } }, { $set: { default: false } }, { multi: true }, (err, numReplaced) => {
            })
            this.props.tariffs.forEach((tariff) => tariff._id !== id && this.props.updateTariffProperty(tariff._id, property, false))
        }

        this.props.updateTariffProperty(id, property, value)

        newData[property] = value
        tariff.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
            if (err)
                console.log(err)
            else console.log(`Update ${numReplaced} tariff(s)!`)
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
                        <TextField {...params} label="Từ khoá" variant="standard" placeholder="Tìm bảng giá" />
                    )}
                    onChange={(event, searchOptionSelecteds: SearchOption[]) => {
                        this.setState({ searchOptionSelecteds })
                    }}
                />
            </Tooltip>)
    }

    render() {
        var { tariffs, screen } = this.props
        var tariffShows = tariffs.filter((tariff: any) => {
            var ok = true
            const groupOptions = lodash.groupBy(this.state.searchOptionSelecteds, "property")
            for (let key in groupOptions) {
                if (key === "typeOfPrice")
                    ok = groupOptions.typeOfPrice.findIndex((option: SearchOption) => option.id === tariff.typeOfPrice) > -1
                else
                    ok = (groupOptions[key].findIndex((option: SearchOption) => option.key === tariff[key])) > -1
                if (!ok) break;
            }
            return ok
        })
        return (
            <EnhancedTable screen={screen}
                tableType={TableTypes.TARIFF}
                selectToolbarColor="rgba(241, 14, 124, 0.3)"
                selectCellColor="rgba(241, 14, 124, 0.1)"
                headCells={headCells}
                selected={this.state.selected}
                onSelect={this.onSelect}
                selectControl={(<Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={this.deleteRows}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>)}
                defaultControl={(<React.Fragment>
                    {this.searchBar()}
                    <Tooltip title="Thêm bảng giá">
                        <IconButton aria-label="Add" onClick={this.addTariff}>
                            <AddBoxIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>

                )}
                updateProperty={this.updateProperty}

                rows={tariffShows as Row[]}
                title="Bảng giá"

            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TariffPage)