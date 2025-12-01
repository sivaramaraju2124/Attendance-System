import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CheckInOut from "./pages/CheckInOut";
import History from "./pages/History";
import Summary from "./pages/Summary";
import ManagerAllEmployees from "./pages/ManagerAllEmployees";
import ExportCSV from "./pages/ExportCSV";
import Navbar from "./components/Navbar";

export default function AppRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  const EmployeeRoute = ({ element }) =>
    token && role === "employee" ? element : <Navigate to="/" />;

  const ManagerRoute = ({ element }) =>
    token && role === "manager" ? element : <Navigate to="/" />;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        <Route path="/employee/dashboard" element={<EmployeeRoute element={<EmployeeDashboard />} />} />
        <Route path="/employee/attendance" element={<EmployeeRoute element={<CheckInOut />} />} />
        <Route path="/employee/history" element={<EmployeeRoute element={<History />} />} />
        <Route path="/employee/summary" element={<EmployeeRoute element={<Summary />} />} />

        <Route path="/manager/dashboard" element={<ManagerRoute element={<ManagerDashboard />} />} />
        <Route path="/manager/employees" element={<ManagerRoute element={<ManagerAllEmployees />} />} />
        <Route path="/manager/export" element={<ManagerRoute element={<ExportCSV />} />} />
      </Routes>
    </>
  );
}


