import React, { Component } from "react";

import "./header.css";
import Icons from "./icons.svg";

class Header extends Component {
  render() {
    return (
      <section className="site-header">
        <div className="site-header__title">
          <svg className="icon project__icon">
            <use xlinkHref={`${Icons}#icon--bill`} />
          </svg>
          <h1 className="site-header__text">
            New York State Bill Tracker for Police Reform
          </h1>
        </div>
        <div className="site-header__slogan">
          <p>
            Easily track the progress of NY State legistation package for police
            reform.
          </p>
        </div>
        <a className="site-header__contact" href="mailto:team@astoria.digital">
          <svg className="icon callout__icon">
            <use xlinkHref={`${Icons}#icon--email`}/>
          </svg>
          <span className="callout__text">Contact Us</span>
        </a>
      </section>
    );
  }
}
export default Header;
