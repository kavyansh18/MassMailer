import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import EmailForm from "./EmailForm.jsx";
import { Homepg } from "./Homepg.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Homepg} />
        <Route path="/form" component={EmailForm} />
      </Switch>
    </Router>
  </React.StrictMode>
);
