import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { PageIds } from '@/utils/types';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Container from '@material-ui/core/Container'
import CustomersPage from '@/pages/CustomerPage'
import { v4 as uuid4 } from 'uuid'
import DateFnsUtils from '@date-io/date-fns';
import { loadScreen } from '@/redux/screen/actions'
import { loadTariffs } from '@/redux/tariffs/actions'
import { loadCustomers } from '@/redux/customers/actions'
import { loadGlands } from '@/redux/glands/actions'
import { loadBanks } from '@/redux/banks/actions'
import { loadSetting } from '@/redux/setting/actions'
import { loadPayTypes } from '@/redux/bills/actions'
import TariffPage from '@/pages/TariffPage'
import GlandPage from '@/pages/GlandPage'
import BillPage from '@/pages/BillPage'
import BankPage from '@/pages/BankPage'
import PayTypePage from '@/pages/PayTypePage'
import SettingsIcon from '@material-ui/icons/Settings';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { tariff, customer, gland, bank, setting, payType } from '@/database'

import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { connect } from 'react-redux';
import SettingPage from '@/pages/SettingPage';
import { IPayType } from '@/redux/bills/types';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    width: "80%",
    padding: theme.spacing(3),
  },
}));

const mapDispatchToProps = {
  loadScreen,
  loadTariffs,
  loadCustomers,
  loadGlands,
  loadBanks,
  loadSetting,
  loadPayTypes
}

interface PropsFromDispatch {
  loadScreen: typeof loadScreen
  loadTariffs: typeof loadTariffs
  loadCustomers: typeof loadCustomers
  loadGlands: typeof loadGlands
  loadBanks: typeof loadBanks
  loadSetting: typeof loadSetting
  loadPayTypes: typeof loadPayTypes
}

interface SelfProps {

}

type Props = PropsFromDispatch & SelfProps

function MiniDrawer({ loadScreen, loadTariffs, loadCustomers, loadGlands, loadBanks, loadSetting, loadPayTypes }: Props) {


  const [open, setOpen] = useState(false);
  const [pageId, changePage] = useState(PageIds.BILLS)
  const theme = useTheme();
  const classes = useStyles(theme);

  useEffect(() => {
    gland.find({}, (err, glands) => {
      if (err)
        console.log(err)
      else
        loadGlands(glands)
    })
    tariff.find({}, (err, tariffs) => {
      if (err)
        console.log(err)
      else
        loadTariffs(tariffs)
    })
    customer.find({}, (err, customers) => {
      if (err)
        console.log(err)
      else
        loadCustomers(customers)
    })
    bank.find({}, (err, banks) => {
      if (err)
        console.log(err)
      else
        loadBanks(banks)
    })
    setting.find({}).sort({ timeUpdate: -1 }).limit(1).exec((err, settings) => {
      if (err)
        console.log(err)
      else
        if (settings.length > 0)
          loadSetting(settings[0])
    })

    payType.find({}, (err, payTypes) => {
      if (err)
        console.log(err)
      else
        if (payTypes.length > 0)
          loadPayTypes(payTypes)
        else {
          const payTypes: IPayType[] = [{
            _id: uuid4(),
            name: "Tiền mặt",
            code: "TM",
            active: true,
            default: true
          },
          {
            _id: uuid4(),
            name: "Chuyển khoản",
            code: "CK",
            active: true,
            default: false
          }]
          payType.insert(payTypes, (err, payTypes) => {
            loadPayTypes(payTypes)
          })
        }
    })
    window.addEventListener('resize', function (event: any) {
      event.preventDefault()
      if (event.srcElement !== null) {
        loadScreen({
          height: event.srcElement.innerHeight as number,
          width: event.srcElement.innerWidth as number,
        })
      }

    });
  });

  const handleChangePage = (pageId: PageIds) => {
    changePage(pageId)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const page = (pageId: PageIds) => {
    switch (pageId) {
      case PageIds.CUSTOMERS: return <CustomersPage />
      case PageIds.TARIFFS: return <TariffPage />
      case PageIds.GLANDS: return <GlandPage />
      case PageIds.BILLS: return <BillPage />
      case PageIds.BANKS: return <BankPage />
      case PageIds.SETTING: return <SettingPage />
      case PageIds.PAY_TYPES: return <PayTypePage />
      default: return <BankPage />
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Quản lý nước sản xuất
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[{ label: 'Hóa đơn', pageId: PageIds.BILLS, icon: <ReceiptOutlinedIcon /> },
          { label: 'Bảng giá', pageId: PageIds.TARIFFS, icon: <LocalAtmIcon /> }].map((item, index) => (
            <ListItem button key={item.pageId} onClick={() => handleChangePage(item.pageId)} style={{
              backgroundColor: item.pageId === pageId ? "rgba(241, 14, 124, 0.2)" : "inherit"
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[{ label: 'Khách hàng', pageId: PageIds.CUSTOMERS, icon: <PeopleAltOutlinedIcon /> },
          { label: 'Tuyến', pageId: PageIds.GLANDS, icon: <LinearScaleIcon /> },
          // { label: 'Ngân hàng', pageId: PageIds.BANKS, icon: <AccountBalanceIcon /> },
          { label: 'Hình thức thanh toán', pageId: PageIds.PAY_TYPES, icon: <AccountBalanceWalletIcon /> }
          ].map((item, index) => (
            <ListItem button key={item.pageId} onClick={() => handleChangePage(item.pageId)} style={{
              backgroundColor: item.pageId === pageId ? "rgba(241, 14, 124, 0.2)" : "inherit"
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[{ label: 'Cài đặt', pageId: PageIds.SETTING, icon: <SettingsIcon /> }].map((item, index) => (
            <ListItem button key={item.pageId} onClick={() => handleChangePage(item.pageId)} style={{
              backgroundColor: item.pageId === pageId ? "rgba(241, 14, 124, 0.2)" : "inherit"
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content} >

        <div className={classes.toolbar} />

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {page(pageId)}
        </MuiPickersUtilsProvider>

      </main>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(MiniDrawer)