import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAllUsers,
  unblockUser,
  getAllTasksAdmin,
} from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const statsData = await getAdminStats();
    const usersData = await getAllUsers();
    const tasksData = await getAllTasksAdmin();

    setStats(statsData || {});
    setUsers(usersData || []);
    setTasks(tasksData || []);
  };

  const handleUnblock = async (id) => {
    await unblockUser(id);
    loadData();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* STATS */}
      <div className="admin-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{stats.totalUsers || 0}</p>
        </div>

        <div className="stat-box">
          <h3>Total Tasks</h3>
          <p>{stats.totalTasks || 0}</p>
        </div>

        <div className="stat-box">
          <h3>Blocked Users</h3>
          <p>{stats.blockedUsers || 0}</p>
        </div>
      </div>

      {/* USERS TABLE */}
      <h2>All Users</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={
                      user.isBlocked
                        ? "badge badge-blocked"
                        : "badge badge-active"
                    }
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  {user.isBlocked &&
                    !user.isPermanentlyBlocked &&
                    user.blockCount < 3 && (
                      <button
                        className="btn-small"
                        onClick={() => handleUnblock(user._id)}
                      >
                        Unblock
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TASKS TABLE */}
      <h2>All Tasks</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Client</th>
              <th>Volunteer</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>
                  <span className={`badge badge-${task.status}`}>
                    {task.status}
                  </span>
                </td>
                <td>{task.client?.name}</td>
                <td>{task.volunteer?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
