import * as React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

export default (propsInObj, el) => {
  ReactDOM.hydrate(<App {...propsInObj} />, el);
};
