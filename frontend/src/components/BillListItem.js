import React, { useState, useEffect } from "react";
import Icons from "./icons.svg";

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "3fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr",
};

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

  console.log("debug", completedSteps.includes(step));
  return completedSteps.includes(step);
}

export default function BillListItem(props) {
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    if (!billData) {
      fetch(`/api/v1/bill/${props.year}/${props.bill}`)
        .then((res) => res.json())
        .then((data) => {
          setBillData(data.result);
        });
    }
  });

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
    <div style={rowStyle}>
      <div className="S8496 bill-description">
        <h2>{fullBillName}</h2>
        <p>{billData.title}</p>
      </div>
      <p className="S8496 overall-status passed">
        {completed("Signed by Governor")
          ? `SIGNED: ${billData.status.actionDate}`
          : ""}
      </p>
      <div className="introduced">
        <svg className="icon status__icon">
          <use xlinkHref={`${Icons}#icon--yes24`} />
        </svg>
      </div>
      <div className="S8496 in-committee">
        {completed("In Committee") && (
          <svg className="icon status__icon">
            <use xlinkHref={`${Icons}#icon--yes24`} />
          </svg>
        )}
      </div>
      <div className="S8496 on-floor">
        {completed("On Floor Calendar") && (
          <svg className="icon status__icon">
            <use xlinkHref={`${Icons}#icon--yes24`} />
          </svg>
        )}
      </div>
      <div className="S8496 pass-two">
        <div className="pass-senate">
          {completed("Passed Senate") && (
            <svg className="icon status__icon">
              <use xlinkHref={`${Icons}#icon--yes24`} />
            </svg>
          )}
        </div>
        <div className="pass-assembly">
          {completed("Passed Assembly") && (
            <svg className="icon status__icon">
              <use xlinkHref={`${Icons}#icon--yes24`} />
            </svg>
          )}
        </div>
      </div>
      <div className="S8496 deliver-gov">
        {completed("Delivered to Governor") && (
          <svg className="icon status__icon">
            <use xlinkHref={`${Icons}#icon--yes24`} />
          </svg>
        )}
      </div>
      <div className="S8496 sign-gov">
        {completed("Signed by Governor") && (
          <svg className="icon status__icon">
            <use xlinkHref={`${Icons}#icon--yes24`} />
          </svg>
        )}
      </div>
    </div>
  );
}
