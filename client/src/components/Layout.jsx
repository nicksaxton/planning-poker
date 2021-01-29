import * as React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <nav className="navbar navbar-light bg-light border-bottom">
        <Link className="navbar-brand" to="/">
          Planning Poker
        </Link>
      </nav>
      <div className="flex-grow-1">
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3 pt-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
