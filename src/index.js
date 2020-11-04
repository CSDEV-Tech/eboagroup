import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "../src/serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import "./utils/css/ui.css";
import "./utils/css/responsive.css";
import App from "./containers/App";
import { store } from "./store";
import { Provider } from "react-redux";
import "./utils/css/App.css";

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

// for reusable render function
const render = component =>
  ReactDOM.render(component, document.getElementById("root"));

// render
render(app);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();

// Webpack Hot Module Replacement API => Hot relaod
if (module.hot) {
  module.hot.accept("./containers/App", () => {
    var NextApp = require("./containers/App").default;
    render(
      <Provider store={store}>
        <NextApp />
      </Provider>
    );
  });
}
