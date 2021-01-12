import * as React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Planning Poker
        </Link>
      </nav>
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
