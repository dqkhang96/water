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
import CustomersPage from '@/pages/CustomersPage'
import DateFnsUtils from '@date-io/date-fns';
import { loadScreen } from '@/redux/screen/actions'
import { loadTariffs } from '@/redux/tariffs/actions'
import { loadCustomers } from '@/redux/customers/actions'
import { loadGlands } from '@/redux/glands/actions'
import TariffPage from '@/pages/TariffPage'
import GlandPage from '@/pages/GlandPage'
import { tariff, customer, gland } from '@/database'

import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { connect } from 'react-redux';

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
    padding: theme.spacing(3),
  },
}));

const mapDispatchToProps = {
  loadScreen,
  loadTariffs,
  loadCustomers,
  loadGlands
}

interface PropsFromDispatch {
  loadScreen: typeof loadScreen
  loadTariffs: typeof loadTariffs
  loadCustomers: typeof loadCustomers
  loadGlands: typeof loadGlands
}

interface SelfProps {

}

type Props = PropsFromDispatch & SelfProps

function MiniDrawer({ loadScreen, loadTariffs, loadCustomers, loadGlands }: Props) {


  const [open, setOpen] = useState(false);
  const [pageId, changePage] = useState(PageIds.CUSTOMERS)
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
      default: return <GlandPage />
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
            Duong gay
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
          { label: 'Bảng giá', pageId: PageIds.TARIFFS, icon: <LocalAtmIcon /> },
          { label: 'Tuyến', pageId: PageIds.GLANDS, icon: <LinearScaleIcon /> }].map((item, index) => (
            <ListItem button key={item.pageId} onClick={() => handleChangePage(item.pageId)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {[{ label: 'Khách hàng', pageId: PageIds.CUSTOMERS, icon: <PeopleAltOutlinedIcon /> },
          { label: 'Ngân hàng', pageId: PageIds.BANKS, icon: <AccountBalanceIcon /> }].map((item, index) => (
            <ListItem button key={item.pageId} onClick={() => handleChangePage(item.pageId)}>
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