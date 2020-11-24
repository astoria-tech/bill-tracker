import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import BillListItem from './BillListItem';

const useStyles = makeStyles({
  header: { color: 'white' },
  list: { background: "transparent", },
  table: { tableLayout: 'fixed' },
  paper: { width: '90%' },
  tableHeader: { fontSize: '1.1rem' },
});

export default function BillList(props) {
  const c = useStyles();
  const [bills, setBills] = useState([]);
  const [currentFilter, setFilter] = useState('SIGNED_BY_GOV')

  useEffect(() => {
    if (bills.length === 0) {

      const paginateBills = async() => {
        let start = 0
        do {
          const res = await fetch(`/api/v1/bills/2019?start=${start}`);
          const {bills, end} = await res.json();
          await setBills((prevBills) => [...prevBills].concat(bills));
          start = end
        } while (start > 0)
      }
      paginateBills()
    }
  });

  // Only keep the completed bills
  console.log(bills.length);

  let filteredBills = bills.filter(x => x.status.statusType == currentFilter);

  const filterByStatus = (status) => { return () => setFilter(status) };

  return (
    <Box display="flex"
      flexDirection="column"
      flexWrap="nowrap"
      alignItems="center"
      p={0}
      bgcolor="background.paper"
      className={c.list}
    >
      <Box padding={3} color="text.primary">
        <Typography gutterBottom className={c.header} variant="h4">
          Progress of Police Reform Legislative Package
        </Typography>
      </Box>

      <Paper className={c.paper}>
        <TableContainer>
          <Table className={c.table} aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell align="center" className={c.tableHeader} colSpan={2}></TableCell>
              <TableCell align="center" className={c.tableHeader}>Introduced</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('IN_SENATE_COMM')}>In Committee</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('SENATE_FLOOR')}>On Floor Calendar</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('PASSED_SENATE')}>Passed Senate</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('PASSED_ASSEMBLY')}>Passed Assembly</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('DELIVERED_TO_GOV')}>Delivered to Governor</TableCell>
              <TableCell align="center" className={c.tableHeader} onClick={filterByStatus('SIGNED_BY_GOV')}>Signed by Governor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBills.map((value, index) => {
                //return <BillListItem key={index} year={value.billId.session} bill={value.billId.printNo} />;
                return <BillListItem key={index} billData={value} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </Box>
  );
}
