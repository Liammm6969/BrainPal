import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOTP from "./pages/auth/VerifyOTP";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudyMaterials from "./pages/Student/StudyMaterials";

import ProtectedRoute from "./routes/ProtectedRoutes";
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/study-materials" element={<ProtectedRoute><StudyMaterials /></ProtectedRoute>} />
    </Routes>
    </div>
  );
}

export default App;
