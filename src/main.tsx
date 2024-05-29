import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./tailwind/output.css";
import Background from "./components/ui/Background.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Background type="mosaic" />
  </React.StrictMode>
);
