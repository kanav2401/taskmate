import { useEffect, useState } from "react";
import {
  getAdminStats,
  getAllUsers,
  unblockUser,
  getAllTasksAdmin,
} from "../api/api";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"];

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

  /* ================= BAN USER ================= */

  const handleBan = async (id, permanent = false) => {
    const reason = prompt("Enter ban reason:");
    if (!reason) return;

    let days = 0;
    if (!permanent) {
      days = prompt("Ban for how many days?");
      if (!days) return;
    }

    await fetch(`http://localhost:5000/api/admin/ban/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reason,
        days,
        permanent,
      }),
    });

    loadData();
  };

  /* ================= APPROVE UNBLOCK REQUEST ================= */

  const handleApproveRequest = async (id) => {
    await fetch(`http://localhost:5000/api/admin/unblock/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    loadData();
  };

  /* ================= Analytics Data ================= */

  const tasksPerDay = Object.values(
    tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  let cumulative = 0;
  const growthTrend = tasksPerDay.map((item) => {
    cumulative += item.count;
    return { ...item, total: cumulative };
  });

  const statusData = Object.values(
    tasks.reduce((acc, task) => {
      const status = task.status;
      if (!acc[status]) acc[status] = { name: status, value: 0 };
      acc[status].value += 1;
      return acc;
    }, {})
  );

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Analytics Dashboard 📊</h1>

      {/* ================= STATS ================= */}
      <div className="admin-stats">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{stats.totalUsers || users.length}</p>
        </div>

        <div className="stat-box">
          <h3>Total Tasks</h3>
          <p>{stats.totalTasks || tasks.length}</p>
        </div>

        <div className="stat-box">
          <h3>Blocked Users</h3>
          <p>{stats.blockedUsers || 0}</p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="charts-grid">

        <div className="chart-card">
          <h2>Tasks Per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= USERS TABLE ================= */}
      <h2>All Users</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Ban Info</th>
              <th>Request</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                style={
                  user.unblockRequested
                    ? { background: "#fff7ed" }
                    : {}
                }
              >
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <span
                    className={
                      user.isBlocked
                        ? "badge badge-overdue"
                        : "badge badge-completed"
                    }
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                {/* Ban Info */}
                <td>
                  {user.isBlocked && (
                    <>
                      <div>Reason: {user.banReason || "—"}</div>

                      {!user.isPermanentlyBlocked && user.banUntil && (
                        <div>
                          Until: {new Date(user.banUntil).toDateString()}
                        </div>
                      )}

                      {user.isPermanentlyBlocked && (
                        <div>Permanent Ban</div>
                      )}
                    </>
                  )}
                </td>

                {/* Unblock Request */}
                <td>
                  {user.unblockRequested && (
                    <>
                      <div style={{ color: "#ea580c", fontWeight: "600" }}>
                        Unblock Requested
                      </div>
                      <div style={{ fontSize: "12px" }}>
                        {user.unblockMessage}
                      </div>
                    </>
                  )}
                </td>

                <td>
                  {!user.isBlocked && user.role !== "admin" && (
                    <>
                      <button
                        className="btn-small"
                        style={{ background: "#f59e0b", marginRight: "5px" }}
                        onClick={() => handleBan(user._id, false)}
                      >
                        Temp Ban
                      </button>

                      <button
                        className="btn-small"
                        style={{ background: "#ef4444" }}
                        onClick={() => handleBan(user._id, true)}
                      >
                        Permanent
                      </button>
                    </>
                  )}

                  {user.isBlocked && !user.unblockRequested && (
                    <button
                      className="btn-small"
                      onClick={() => handleUnblock(user._id)}
                    >
                      Unblock
                    </button>
                  )}

                  {user.unblockRequested && (
                    <button
                      className="btn-small"
                      style={{ background: "#16a34a" }}
                      onClick={() => handleApproveRequest(user._id)}
                    >
                      Approve Request
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
