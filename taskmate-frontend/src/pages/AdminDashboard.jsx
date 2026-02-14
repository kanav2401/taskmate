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

  /* ================= Analytics Data ================= */

  // Group tasks by day
  const tasksPerDay = Object.values(
    tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  );

  // Growth trend (cumulative)
  let cumulative = 0;
  const growthTrend = tasksPerDay.map((item) => {
    cumulative += item.count;
    return { ...item, total: cumulative };
  });

  // Status distribution
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

        {/* 📊 Bar Chart */}
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

        {/* 📈 Line Chart */}
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

        {/* 🥧 Pie Chart */}
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
                        ? "badge badge-overdue"
                        : "badge badge-completed"
                    }
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  {user.isBlocked && (
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
    </div>
  );
}
