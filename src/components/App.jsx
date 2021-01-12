import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CreateSession from "./CreateSession";
import JoinSession from "./JoinSession";
import LandingPage from "./LandingPage";
import Session from "./Session";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/create">
          <CreateSession />
        </Route>
        <Route path="/join">
          <JoinSession />
        </Route>
        <Route path="/session/:sessionCode">
          <Session />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
