import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </div>
  );
}

export default App;
