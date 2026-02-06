import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseTasks from "./pages/BrowseTasks";
import PostTask from "./pages/PostTask";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
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
    </Routes>
  );
}
