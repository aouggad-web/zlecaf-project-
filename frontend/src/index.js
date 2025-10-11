import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Fix pour ResizeObserver loop error
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
const resizeObserverLoopErr = (e) => {
  if (e.message && resizeObserverLoopErrRe.test(e.message)) {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div');
    const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErr) resizeObserverErr.setAttribute('style', 'display: none');
    if (resizeObserverErrDiv) resizeObserverErrDiv.setAttribute('style', 'display: none');
  }
};
window.addEventListener('error', resizeObserverLoopErr);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
