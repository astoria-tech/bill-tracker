import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Link from "@material-ui/core/Link";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({
  root: {
    margin: "10px",
    width: "1000px",
  },

  none: {},
  greenBG: {
    background: "green",
    border: "10px solid white",
    borderRadius: "30px",
    fontSize: "1rem",
    color: "white",
  },

  media: { height: 140 },

  billName: {
    fontSize: "1.2rem",
    width: "100px",
  },
});

function stepCompleted(billData, step) {
  const completedSteps =
    {
      IN_SENATE_COMM: ["In Committee"],
      SENATE_FLOOR: ["In Committee", "On Floor Calendar"],
      PASSED_SENATE: ["In Committee", "On Floor Calendar", "Passed Senate"],

      IN_ASSEMBLY_COMM: ["In Committee"],
      ASSEMBLY_FLOOR: ["In Committee", "On Floor Calendar"],
      PASSED_ASSEMBLY: ["In Committee", "On Floor Calendar", "Passed Assembly"],

      DELIVERED_TO_GOV: [
        "In Committee",
        "On Floor Calendar",
        "Passed Senate",
        "Passed Assembly",
        "Delivered to Governor",
      ],
      SIGNED_BY_GOV: [
        "In Committee",
        "On Floor Calendar",
        "Passed Senate",
        "Passed Assembly",
        "Delivered to Governor",
        "Signed by Governor",
      ],
      VETOED: [
        "In Committee",
        "On Floor Calendar",
        "Passed Senate",
        "Passed Assembly",
        "Delivered to Governor",
        "Vetoed",
      ],
    }[billData.status.statusType] || [];

  return completedSteps.includes(step);
}

export default React.memo(function BillListItem(props) {
  const c = useStyles();

  const billData = props.billData;

  // Don't render anything if there is no data
  if (billData === null) {
    return "";
  }

  // Prepare the full bill name
  let fullBillName;
  if (billData.billType.chamber === "SENATE") {
    fullBillName = `Senate Bill ${billData.printNo}`;
  } else {
    fullBillName = `Assembly Bill ${billData.printNo}`;
  }

  let billURL = `https://www.nysenate.gov/legislation/bills/${billData.session}/${billData.printNo}`;

  const completed = (step) => stepCompleted(billData, step);

  return (
    <TableRow key={billData.printNo}>
      <TableCell
        component="th"
        scope="row"
        colSpan={2}
        align="center"
        className={c.billName}
      >
        <Link target="_blank" href={billURL}>
          {fullBillName}
        </Link>
        <br />
        {billData.title}
      </TableCell>
      <TableCell className={c.greenBG}></TableCell>
      <TableCell
        className={completed("In Committee") ? c.greenBG : c.none}
      ></TableCell>
      <TableCell
        className={completed("On Floor Calendar") ? c.greenBG : c.none}
      ></TableCell>
      <TableCell
        className={completed("Passed Senate") ? c.greenBG : c.none}
      ></TableCell>
      <TableCell
        className={completed("Passed Assembly") ? c.greenBG : c.none}
      ></TableCell>
      <TableCell
        className={completed("Delivered to Governor") ? c.greenBG : c.none}
      ></TableCell>
      <TableCell
        className={completed("Signed by Governor") ? c.greenBG : c.none}
        align="center"
      >
        {completed("Signed by Governor")
          ? `SIGNED: ${billData.status.actionDate}`
          : ""}
      </TableCell>
    </TableRow>
  );
});
