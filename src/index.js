import React from "react";
import ReactDOM from "react-dom";
import LandingPage from "./landingpage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./styles.css";
import Login from "./Login";
import "./css/bootstrap.min.css";
import "./css/cover.css";
import Signup from "./Signup";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
