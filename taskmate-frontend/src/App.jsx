import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTasks from "./pages/BrowseTasks";
import PostTask from "./pages/PostTask";
import ClientDashboard from "./pages/ClientDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import TaskDetail from "./pages/TaskDetail";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import BlockedBanner from "./components/BlockedBanner";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";




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
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

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
          <Route
  path="/admin-dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
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
