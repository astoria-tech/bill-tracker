import Fuse from "fuse.js";
import React, { useState, useEffect } from "react";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import BillListItem from "./BillListItem";

const useStyles = makeStyles({
  header: { color: "white" },
  filterText: { backgroundColor: "white" },
  list: { background: "transparent" },
  table: { tableLayout: "fixed" },
  paper: { width: "90%" },
  tableHeader: { fontSize: "1.1rem" },
});

function billContainsText(bill, text) {
  const titleMatches = (bill.title || "").includes(text);
  const descriptionMatches = (bill.description || "").includes(text);
  return titleMatches || descriptionMatches;
}

function filterBillsByText(bills, text) {
  return bills.filter((b) => billContainsText(b, text));
}

export default function BillList(props) {
  const c = useStyles();

  const [allBills, setAllBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState("SIGNED_BY_GOV");
  const [textFilter, setTextFilter] = useState("");
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    console.log(
      "current state:",
      filteredBills.length,
      allBills.length,
      textFilter
    );
  });

  // Fetch the bills if they haven't been yet
  if (!allBills.length) {
    fetch(`/api/v1/bills/2019`)
      .then((res) => res.json())
      .then((data) => {
        // Store the full and filtered lists of bills
        setAllBills(data);
        setFilteredBills(filterBillsByText(data, textFilter));

        // Create the fuse object (for quick text filtering)
        setFuse(new Fuse(data, { keys: ["title", "author.firstName"] }));
      });
  }

  // Create text filter change handler
  const filterChanged = (event) => {
    let newFilterValue = event.target.value;
    //setTextFilter(newFilterValue);
    //setFilteredBills(filterBillsByText(allBills, newFilterValue));
    console.log("fuse is:", fuse);
    if (fuse) {
      setFilteredBills(fuse.search(newFilterValue).map((x) => x.item));
    }
  };

  // Filter the bills status
  let statusFilteredBills = filteredBills.filter(
    (x) => x.status.statusType === statusFilter
  );

  // Create the onclick handler factory
  const filterByStatus = (status) => {
    return () => setStatusFilter(status);
  };

  return (
    <Box
      display="flex"
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

      <Box padding={3} color="text.primary">
        <TextField
          className={c.filterText}
          label="Filter bills by text"
          onChange={filterChanged}
          variant="filled"
        />
      </Box>

      <Paper className={c.paper}>
        <TableContainer>
          <Table className={c.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  colSpan={2}
                ></TableCell>
                <TableCell align="center" className={c.tableHeader}>
                  Introduced
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("IN_SENATE_COMM")}
                >
                  In Committee
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("SENATE_FLOOR")}
                >
                  On Floor Calendar
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("PASSED_SENATE")}
                >
                  Passed Senate
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("PASSED_ASSEMBLY")}
                >
                  Passed Assembly
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("DELIVERED_TO_GOV")}
                >
                  Delivered to Governor
                </TableCell>
                <TableCell
                  align="center"
                  className={c.tableHeader}
                  onClick={filterByStatus("SIGNED_BY_GOV")}
                >
                  Signed by Governor
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statusFilteredBills.slice(0, 100).map((value, index) => {
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
