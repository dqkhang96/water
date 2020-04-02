import React, { Component } from 'react'
import { addGland, deleteGland, updateGlandProperty } from '@/redux/glands/actions'
import { glands } from '@/redux/glands/selectors'
import { IGland } from '@/redux/glands/types'
import { AppState } from '@/redux'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable'
import { Types, TableTypes } from '@/utils/types'
import { connect } from 'react-redux'
import { gland } from '@/database'
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
        propertyName: "code",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Mã tuyến"
    }, {
        propertyName: "name",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Tên bảng giá"
    },

    {
        propertyName: "curator",
        type: Types.STRING,
        disableEditor: false,
        disablePadding: false,
        label: "Người phụ trách"
    },
    {
        propertyName: "zone",
        type: Types.NUMBER,
        disableEditor: false,
        disablePadding: false,
        label: "Thuộc khu vực"
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
    addGland: typeof addGland
    deleteGland: typeof deleteGland
    updateGlandProperty: typeof updateGlandProperty
}
const mapDispatchToProps = {
    addGland,
    deleteGland,
    updateGlandProperty
}


interface PropsFromState {
    glands: IGland[]
    screen: IScreen
}

const mapStateToProps = (state: AppState) => ({
    glands: glands(state),
    screen: screen(state)
})

interface SelfProps {

}

type Props = SelfProps & PropsFromState & PropsFromDispatch


const newGland: IGland = {
    _id: uuid4(),
    code: "NEW",
    name: "Bảng giá mới",
    curator: "Dương Bính",
    zone: "Xuân Phú",
    active: true
}

interface State {
    selected: string[]
    searchOptions: SearchOption[]
    searchOptionSelecteds: SearchOption[]
}

class GlandPage extends Component<Props, State>{

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
        const { glands } = props ? props : this.props
        var searchOptions: SearchOption[] = []
        const properties: string[] = ["code", "curator", "name", "curator", "zone"]
        properties.forEach((property: string) => {
            var pros: SearchOption[] = glands.map((gland: any) => {
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
        gland.insert({ ...newGland, _id: uuid4() }, (err, newGland) => {
            if (err)
                console.log(err)
            else
                this.props.addGland(newGland)
        })
    }

    deleteRows() {
        const ids = this.state.selected
        this.props.deleteGland(ids)
        this.setState({ selected: [] })
        gland.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err)
                console.log(err)
            else console.log(`Delete ${numRemoved} gland(s)!`)
        })
    }

    updateProperty(id: string, property: string, value: any) {
        var newData: { [key: string]: any } = {}

        this.props.updateGlandProperty(id, property, value)

        newData[property] = value
        gland.update({ _id: id }, { $set: newData }, {}, (err, numReplaced) => {
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
                        <TextField {...params} label="Từ khoá" variant="standard" placeholder="Tìm tuyến" />
                    )}
                    onChange={(event, searchOptionSelecteds: SearchOption[]) => {
                        this.setState({ searchOptionSelecteds })
                    }}
                />
            </Tooltip>)
    }

    render() {
        var { glands, screen } = this.props
        const { searchOptionSelecteds } = this.state
        var glandsShow = glands.filter((gland: any) => {
            var ok = true
            const groupOptions = lodash.groupBy(searchOptionSelecteds, "property")
            for (let key in groupOptions) {
                ok = !!(groupOptions[key].find((option: SearchOption) => option.key === gland[key]))
                if (!ok) break;
            }
            return ok
        })
        return (
            <EnhancedTable screen={screen}
                tableType={TableTypes.GLAND}
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

                rows={glandsShow as Row[]}
                title="Tuyến"

            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlandPage)