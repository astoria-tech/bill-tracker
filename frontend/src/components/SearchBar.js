import React, { Component } from "react";
import "./SearchBar.css";

class SearchBar extends Component {
  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by bill title or descrition..."
        />
        <button type="submit">Search</button>
      </div>
    );
  }
}
export default SearchBar;
