require("dotenv").config();
import React from "react";
import Routes from "./Routes";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import "./styles.min.css";

ReactDOM.render(<Routes />, document.getElementById("root"));
