import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./protectedRoute";
import WasteForm from "./WasteForm";
import Login from "./login";
import WasteDetailsPage from "./wasteDetail";
import AdminApproval from "./adminApproval";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />

          {/* Protected routes for authenticated users */}
          <Route
            path="/wasteForm"
            element={<ProtectedRoute element={<WasteForm />} />}
          />
          <Route
            path="/waste/:id"
            element={
              <ProtectedRoute element={<WasteDetailsPage />} requireAdmin />
            }
          />

          {/* Protected routes for admins only */}
          <Route
            path="/admin/approve"
            element={
              <ProtectedRoute element={<AdminApproval />} requireAdmin />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
