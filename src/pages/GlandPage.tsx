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

class GlandPage extends Component<Props>{

    constructor(props: Props) {
        super(props)
        this.updateProperty = this.updateProperty.bind(this)
        this.addGland = this.addGland.bind(this)
        this.deleteRows = this.deleteRows.bind(this)
    }

    componentDidMount() {

    }

    addGland() {
        gland.insert({ ...newGland, _id: uuid4() }, (err, newGland) => {
            if (err)
                console.log(err)
            else
                this.props.addGland(newGland)
        })
    }

    deleteRows(ids: string[]) {
        this.props.deleteGland(ids)
        gland.remove({ _id: { $in: ids } }, (err, numRemoved) => {
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
                headCells={headCells}
                updateProperty={this.updateProperty}
                deleteRows={this.deleteRows}
                rows={glands as Row[]}
                title="Quản lý khách hàng"
                addRow={this.addGland}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlandPage)