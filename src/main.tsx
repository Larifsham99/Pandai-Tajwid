import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initInstall } from "./lib/install";

initInstall();

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    const hadController = !!navigator.serviceWorker.controller;
    // Muat semula sekali apabila service worker baharu mengambil alih → pengguna terus dapat versi terkini.
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then((reg) => {
      reg.update().catch(() => {});
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
    }).catch(() => {});
  });
}
