import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TicketContextProvider } from "./context/ticketContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TicketContextProvider>
      <App />
    </TicketContextProvider>
  </StrictMode>
);
