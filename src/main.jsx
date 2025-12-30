import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/index.css"; // Tailwind directives
import { FeedbackProvider } from "./components/feedback/Toast";
import { AuthProvider } from "./context/AuthContext";
import { AcademicProvider } from "./context/AcademicContext";

/**
 * Root mounting point for the School ERP.
 * The Provider nesting order ensures that Academic metadata
 * is only fetched once the User is authenticated.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Global Toast Notifications (Attractive UI feedback) */}
    <FeedbackProvider />

    <AuthProvider>
      {/* AcademicProvider handles the dynamic Year/Campus switching logic */}
      <AcademicProvider>
        <App />
      </AcademicProvider>
    </AuthProvider>
  </React.StrictMode>
);
