import React, { useState, useEffect } from 'react';

import BillListItem from './BillListItem';
import Header from './Header';
import Search from './Search';
import './BillList.css'

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [currentFilter, setFilter] = useState('SIGNED_BY_GOV')

  useEffect(() => {
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
  }, []); // Only run on initial page load

  // filter by the user's input and subject, if chosen
  let filteredBills = bills.filter(x => {
    return (
      x.status.statusType === currentFilter &&
      (
        x.title.toLowerCase().includes(search.toLowerCase()) ||
        x.basePrintNo.toLowerCase().includes(search.toLowerCase()) // S11, A29A, etc.
      ) &&
      (
        (x.status.committeeName && x.status.committeeName.toLowerCase().includes(subject.toLowerCase())) ||
        x.summary.toLowerCase().includes(subject.toLowerCase())
      )
    );
  }).slice(0, 500); // The user does not need to see 23,000 bills

  const filterByStatus = (status) => { return () => setFilter(status) };

  const handleSubjectClick = (event) => {
    event.persist()
    setSubject((prev) => {
      // remove subject filter if the same button is clicked twice in a row
      if (prev === event.target.value) return '';
      return event.target.value;
    })
  }

  return (
    <div>
      <Header></Header>
      <div className="search">
        <div className="subject-select-buttons">
          <p>Filter bills by subject</p>
          <button value="police" onClick={handleSubjectClick}>Police Reform</button>
          <button value="labor" onClick={handleSubjectClick}>Labor Rights</button>
          <button value="hate crime" onClick={handleSubjectClick}>Hate Crimes</button>
          <button value="education" onClick={handleSubjectClick}>Education</button>
        </div>
        <Search setSearchText={setSearch}/>
      </div>
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
