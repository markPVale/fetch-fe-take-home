import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRoutes;
