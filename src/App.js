import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Breakout from "./components/breakout";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Breakout />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;