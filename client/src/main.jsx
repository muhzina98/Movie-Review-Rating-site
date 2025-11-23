import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import "./index.css";
import axios from "axios";
axios.defaults.baseURL = "/api";          
axios.defaults.withCredentials = true; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
