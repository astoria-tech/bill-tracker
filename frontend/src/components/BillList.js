import React from "react";
import Header from "./Header.js";
import BillListItem from "./BillListItem";
import SearchBar from "./SearchBar.js";

export default function BillList(props) {
  return (
    <div>
      <Header></Header>
      <SearchBar></SearchBar>
      <section className="content">
        <div className="table-head">DESCRIPTION</div>
        <div className="table-head overall-status">OVERALL STATUS</div>
        <div className="table-head">INTRODUCED</div>
        <div className="table-head">IN COMMITTEE</div>
        <div className="table-head">ON FLOOR CALENDAR</div>
        <div className="table-head pass-two">
          <p className="header-senate-paragraph">PASSED SENATE</p>
          <p className="header-assembly-paragraph">PASSED ASSEMBLY</p>
        </div>
        <div className="table-head">DELIVERED TO GOVERNOR</div>
        <div className="table-head">SIGNED BY GOVERNOR</div>
      </section>
      <div className="bill">
        {props.bills.map((value, index) => {
          return <BillListItem key={index} year={value[0]} bill={value[1]} />;
        })}
      </div>
    </div>
  );
}
