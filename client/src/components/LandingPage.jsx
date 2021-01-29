import * as React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="jumbotron vh-100 d-flex justify-content-center align-items-center mb-0">
      <div>
        <h1 className="display-4 text-center mb-4">Planning Poker</h1>
        <Link className="btn btn-primary btn-lg btn-block" to="/create">
          Create Session
        </Link>
        <Link className="btn btn-secondary btn-lg btn-block" to="/join">
          Join Session
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
