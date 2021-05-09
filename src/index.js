import React from "react";
import ReactDOM from "react-dom";
import LandingPage from "./landingpage";

import "./styles.css";


function App() {
  return (
    <div className="App">
      <h1>Validated Login Form</h1>
      <LandingPage/>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
