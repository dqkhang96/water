import React, { useEffect, useState } from 'react';
import electron from 'electron'

import ReactDOM from 'react-dom'
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { Types, TableTypes } from '@/utils/types';
import TextField from '@material-ui/core/TextField';
import { ICustomer } from '@/redux/customers/types';
import { IBill } from '@/redux/bills/types';
import Container from '@material-ui/core/Container';
import AddBoxIcon from '@material-ui/icons/AddBox';
import InputDynamic from '@/components/InputDynamic'
import { ITariff } from '@/redux/tariffs/types';
import { IGland } from '@/redux/glands/types';
import { IBank } from '@/redux/banks/types'
import { ResizableBox } from 'react-resizable';
import { Resizable } from 're-resizable'
import { Box } from '@material-ui/core';
import VerticalAlignTopSharpIcon from '@material-ui/icons/VerticalAlignTopSharp';
import { IScreen } from '@/redux/screen/types';

export type Row = (ICustomer | IBill | ITariff | IGland | IBank) & { [key: string]: string | number | [] }


type Order = 'asc' | 'desc';


export interface HeadCell {
  disablePadding: boolean
  disableEditor: boolean
  hide?: boolean
  propertyName: string
  label: string
  type: Types
  isArray?: boolean
  sortField?: boolean
  notNull?: boolean
  width?: number
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[]
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" align="center" className={classes.tableCell}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            padding={"default"}
            key={headCell.propertyName}
            align={"left"}
            scope="row"
            sortDirection={orderBy === headCell.propertyName ? order : false}
            component="th"
            className={classes.tableCell}
          >
            <Resizable
              enable={{ right: true }}
            >
              <TableSortLabel
                className={classes.tableLabel}
                style={{ minWidth: headCell.width ? headCell.width : 200 }}
                active={orderBy === headCell.propertyName}
                direction={orderBy === headCell.propertyName ? order : 'asc'}
                onClick={createSortHandler(headCell.propertyName)}
              >
                {headCell.label}
                {orderBy === headCell.propertyName ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>

            </Resizable>
          </TableCell>
        ))}
      </TableRow>
    </TableHead >
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    title: {
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number
  title: string
  selectControl: React.ReactNode
  defaultControl: React.ReactNode
  selectColor: string
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, title, defaultControl, selectControl, selectColor } = props;

  return (
    <Toolbar
      className={clsx(classes.root)}
      style={{ backgroundColor: numSelected > 0 ? selectColor : "inherit" }}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} variant="inherit">
          {numSelected} selected
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      {numSelected > 0 ? selectControl : defaultControl}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    paper: {
      marginBottom: theme.spacing(1)
    },
    container: {
      paddingLeft: 10, paddingRight: 10,
      width: "100%"
    },
    tableContainer: {
      paddingLeft: 0, paddingRight: 0,
    },
    table: {
      display: "block"
    },
    tableCell: {
      padding: theme.spacing(0),
      top: 0,
      whiteSpace: "normal",
      wordWrap: "break-word"
    },
    tableLabel: {
      whiteSpace: 'nowrap', minWidth: 200, textAlign: "center"
    },
    tableLabelCheckbox: {

    },
    input: {
      width: "95%"
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

interface SelfProps {
  rows: Array<Row>
  headCells: HeadCell[]
  title: string
  updateProperty: (id: string, fieldName: string, value: any) => void
  screen: IScreen
  onSelect: (selected: string[]) => void
  selectControl: React.ReactNode
  defaultControl: React.ReactNode
  selected: string[]
  selectToolbarColor: string
  selectCellColor: string
  tableType: TableTypes
}

type Props = SelfProps

export default function EnhancedTable({ rows, headCells, title, selectControl, defaultControl, updateProperty, screen, onSelect, selected, tableType, selectToolbarColor, selectCellColor }: Props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const stableSort = (array: Row[], comparator: (a: Row, b: Row) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index] as [Row, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  const descendingComparator = (a: Row, b: Row, orderBy: string) => {

    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  const getComparator = (
    order: Order,
    orderBy: string
  ): (a: Row, b: Row) => number => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n._id);
      onSelect(newSelecteds);
      return;
    }
    onSelect([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, _id: string) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    onSelect(newSelected)
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (_id: string) => selected.indexOf(_id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Container className={classes.container} style={{
        marginBottom: 8, marginTop: 18
      }}>
        <Paper className={classes.paper} >
          <EnhancedTableToolbar selectColor={selectToolbarColor} numSelected={selected.length} title={title} selectControl={selectControl} defaultControl={defaultControl} />
        </Paper>
      </Container>
      <Container fixed className={classes.container} >
        <Paper className={classes.paper} >
          <TableContainer className={classes.tableContainer}
            style={{ height: 0.97 * (screen.height - 230) }}
          >
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              stickyHeader
            >
              <EnhancedTableHead
                headCells={headCells}
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        style={{
                          backgroundColor: isItemSelected ? selectCellColor : "inherit",
                        }}
                        tabIndex={-1}
                        key={row._id}

                      >
                        <TableCell padding="checkbox" className={classes.tableCell}>
                          <Checkbox
                            onClick={event => handleClick(event, row._id)}
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        {headCells.map((cel, _) => (
                          <TableCell key={`${cel.propertyName}-${row._id}`} component="td" id={labelId}
                            scope="row" padding={cel.type === Types.BOOLEAN ? "checkbox" : "none"} className={classes.tableCell}>
                            <InputDynamic tableType={tableType} row={row} classes={classes.input} onChange={(value) => updateProperty(row._id, cel.propertyName, value)} headCell={cel} value={row[cel.propertyName]} />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

    </div>
  );
}
