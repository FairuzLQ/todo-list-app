import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ChecklistPage from "../pages/ChecklistPage";
import ChecklistDetailPage from "../pages/ChecklistDetailPage";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/checklists" element={<ChecklistPage />} />
      <Route path="/checklist/:checklistId" element={<ChecklistDetailPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
