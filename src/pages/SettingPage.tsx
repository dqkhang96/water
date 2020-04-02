import React, { Component } from 'react'
import { ISetting } from '@/redux/setting/types'
import { changeBillDate, loadSetting } from '@/redux/setting/actions'
import { setting as settingDb } from '@/database'
import { setting } from '@/redux/setting/selectors'
import { AppState } from '@/redux'
import { connect } from 'react-redux'
import { Container, Paper, Box } from '@material-ui/core'
import { TextField, InputLabel, FormControl, Button } from '@material-ui/core';
import { v4 as uuid4 } from 'uuid'


interface PropsFromDispatch {
    changeBillDate: typeof changeBillDate
    loadSetting: typeof loadSetting

}

const mapDispatchToProps = {
    changeBillDate,
    loadSetting
}

interface PropsFromState {
    setting: ISetting
}

const mapStateToProps = (state: AppState) => ({
    setting: setting(state)
})

interface SelfProps {

}

type Props = SelfProps & PropsFromDispatch & PropsFromState
interface State {
    setting: ISetting
}

class SettingPage extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        this.state = {
            setting: props.setting,

        }
    }

    render() {
        const { setting } = this.state
        const { loadSetting } = this.props
        return (
            <Container maxWidth="lg" fixed>
                <Paper>
                    <Box padding={3}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <InputLabel>Ngày tính tiền</InputLabel>
                                    </td>
                                    <td>
                                        <TextField
                                            value={setting.dateBill === -1 ? "" : setting.dateBill}
                                            onChange={(event) => {
                                                const number = Number.parseInt(event.target.value)
                                                if (!number)
                                                    this.setState({
                                                        setting: {
                                                            _id: uuid4(),
                                                            ...setting,
                                                            dateBill: !event.target.value ? -1 : 1
                                                        }
                                                    })
                                                else
                                                    this.setState({
                                                        setting: {
                                                            ...setting,
                                                            _id: uuid4(),
                                                            dateBill: (number > 0) && (number < 32) ? number : 1
                                                        }
                                                    })
                                            }}
                                            placeholder="Ngày lập hoá đơn"
                                            style={{
                                                width: 80
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <InputLabel>Tên công ty</InputLabel>
                                    </td>
                                    <td>
                                        <TextField

                                            value={setting.nameInBill}
                                            onChange={(event) => this.setState({
                                                setting: {
                                                    ...setting,
                                                    _id: uuid4(),
                                                    nameInBill: event.target.value
                                                }
                                            })}
                                            placeholder="Tên công ty"
                                            style={{
                                                width: 400
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Button

                            disabled={((this.props.setting) && (setting._id)) ? (this.props.setting._id === setting._id) : true}
                            style={{ marginTop: 10 }} variant="contained" color="primary" onClick={() => settingDb.insert({ ...setting, timeUpdate: new Date() }, (err, setting) => {
                                if (err)
                                    console.log(err)
                                this.setState({ setting })
                                loadSetting(setting)
                            })}>
                            Lưu
                        </Button>
                    </Box>
                </Paper>
            </Container >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingPage)