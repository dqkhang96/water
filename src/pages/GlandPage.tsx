import React, { Component } from 'react'
import { addGland, deleteGland, updateGlandProperty } from '@/redux/glands/actions'
import { glands } from '@/redux/glands/selectors'
import { IGland } from '@/redux/glands/types'
import { AppState } from '@/redux'
import EnhancedTable, { HeadCell, Row } from '@/components/EnhancedTable'
import { Types } from '@/utils/types'
import { connect } from 'react-redux'
import { gland } from '@/database'
import { v4 as uuid4 } from 'uuid'
import { screen } from '@/redux/screen/selectors'
import { IScreen } from '@/redux/screen/types'
import { Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';


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
}

class GlandPage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: []
        }
        this.updateProperty = this.updateProperty.bind(this)
        this.addGland = this.addGland.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    componentDidMount() {

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


    render() {
        var { glands, screen } = this.props
        return (
            <EnhancedTable screen={screen}
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
                    <Tooltip title="Search">
                        <TextField id="standard-basic" label="Search" />
                    </Tooltip>
                    <Tooltip title="Add">
                        <IconButton aria-label="Add" onClick={this.addGland}>
                            <AddBoxIcon />
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
                )}
                updateProperty={this.updateProperty}

                rows={glands as Row[]}
                title="Tuyến"

            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlandPage)