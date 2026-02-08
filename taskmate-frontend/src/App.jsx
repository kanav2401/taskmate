import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTasks from "./pages/BrowseTasks";
import PostTask from "./pages/PostTask";
import ClientDashboard from "./pages/ClientDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import TaskDetail from "./pages/TaskDetail";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* VOLUNTEER */}
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowseTasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENT */}
        <Route
          path="/post-task"
          element={
            <ProtectedRoute>
              <PostTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* TASK DETAILS (🔥 THIS FIXES YOUR ERROR) */}
        <Route
          path="/task/:id"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
