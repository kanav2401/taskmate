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
import BlockedBanner from "./components/BlockedBanner";

import { getUser } from "./utils/auth";

function App() {
  const user = getUser();

  return (
    <div className="app-layout">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* BLOCKED USER WARNING */}
      {user?.isBlocked && <BlockedBanner />}

      {/* MAIN PAGE CONTENT */}
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowseTasks />
              </ProtectedRoute>
            }
          />

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

          <Route
            path="/volunteer-dashboard"
            element={
              <ProtectedRoute>
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task/:id"
            element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* FOOTER ALWAYS AT BOTTOM */}
      <Footer />
    </div>
  );
}

export default App;
