import React, { useState, useEffect } from 'react';

import BillListItem from './BillListItem';
import Header from './Header';
import Search from './Search';
import './BillList.css'

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [currentFilter, setFilter] = useState('SIGNED_BY_GOV')

  useEffect(() => {
    if (bills.length === 0) {

      const paginateBills = async() => {
        let start = 0
        let api = 'http://localhost:3000/api/v1/bills/' // TODO: make formal production environment
        do {
          const res = await fetch(api + `2019?start=${start}`);
          const {bills, end} = await res.json();
          await setBills((prevBills) => [...prevBills].concat(bills));
          start = end
        } while (start > 0)
      }
      paginateBills()
    }
  });

  let filteredBills = bills.filter(x => {
    return (
      x.status.statusType === currentFilter &&
      (
        x.title.toLowerCase().includes(search.toLowerCase()) ||
        x.basePrintNo.toLowerCase().includes(search.toLowerCase()) // S11, A29A, etc.
      )
    );
  }).slice(0, 500); // The user does not need to see 23,000 bills

  const filterByStatus = (status) => { return () => setFilter(status) };

  return (
    <div>
      <Header></Header>
      <Search setSearchText={setSearch}/>
      <section className="content">
        <div className="table-head">DESCRIPTION</div>
        <div className="table-head">OVERALL STATUS</div>
        <div className="table-head">INTRODUCED</div>
        <div className="table-head" onClick={filterByStatus('IN_SENATE_COMM')}>IN COMMITTEE</div>
        <div className="table-head" onClick={filterByStatus('SENATE_FLOOR')}>ON FLOOR CALENDAR</div>
        <div className="table-head pass-two">
          <p className="header-senate-paragraph" onClick={filterByStatus('PASSED_SENATE')}>PASSED SENATE</p>
          <p className="header-assembly-paragraph" onClick={filterByStatus('PASSED_ASSEMBLY')}>PASSED ASSEMBLY</p>
        </div>
        <div className="table-head" onClick={filterByStatus('DELIVERED_TO_GOV')}>DELIVERED TO GOVERNOR</div>
        <div className="table-head" onClick={filterByStatus('SIGNED_BY_GOV')}>SIGNED BY GOVERNOR</div>
      </section>
      <div className="bill">
        {filteredBills.map((value, index) => {
          return <BillListItem key={index} billData={value} />;
        })}
      </div>
    </div>
  );
}
