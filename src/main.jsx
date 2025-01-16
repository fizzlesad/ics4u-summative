import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./context";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>
);

