import React from "react";
import "./index.css";
//import './App.css';
import BillList from "./components/BillList";

const BILLS = [
  ["2019", "S8496"],
  ["2019", "S2574b"],
  ["2019", "S3253b"],
  ["2019", "A6144"],
  ["2019", "S3595b"],
  ["2019", "A10609"],
  ["2019", "A1531"],
  ["2019", "S6601a"],
  ["2019", "S8493"],
  ["2019", "A10608"],
];

function App() {
  return (
    <div className="App">
      <BillList bills={BILLS} />
    </div>
  );
}

export default App;
