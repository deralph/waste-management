import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./protectedRoute";
import WasteForm from "./WasteForm";
import Login from "./login";
import WasteDetailsPage from "./wasteDetail";
import AdminApproval from "./adminApproval";
import WasteDashboard from "./userPage";
import AdminCreation from "./AdminCreation";

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
            path="/userpage"
            element={<ProtectedRoute element={<WasteDashboard />} />}
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
          <Route
            path="/create-admin"
            element={
              <ProtectedRoute element={<AdminCreation />} requireAdmin />
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
