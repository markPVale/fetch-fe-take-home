import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import SearchPage from "../pages/searchPage";

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
