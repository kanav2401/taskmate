import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminStats,
  getAllUsers,
  unblockUser,
  getAllTasksAdmin,
} from "../api/api";
import Pagination from "../components/Pagination";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { LayoutDashboard, AlertCircle, Users, CheckCircle, Target, ArrowRight, ShieldCheck, ShieldAlert, Lock, Unlock } from "lucide-react";

// Theme-compatible colors
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  /* PAGINATION STATES */
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(8);
  const [userTotal, setUserTotal] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [taskPage, setTaskPage] = useState(1);
  const [taskLimit, setTaskLimit] = useState(10); // unused for now but kept for API match
  // ... ommiting full task pagination UI for brevity, focusing on charts & user table

  useEffect(() => { loadData(); }, [userPage, userLimit, taskPage, taskLimit]);

  const loadData = async () => {
    const statsData = await getAdminStats();
    const usersData = await getAllUsers(userPage, userLimit);
    const tasksData = await getAllTasksAdmin(taskPage, 1000); // load more for charts

    setStats(statsData || {});
    setUsers(usersData?.data || []);
    setUserTotal(usersData?.total || 0);
    setUserTotalPages(usersData?.totalPages || 1);
    setTasks(tasksData?.data || []);
  };

  const handleUnblock = async (id) => {
    await unblockUser(id);
    loadData();
  };

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
      body: JSON.stringify({ reason, days, permanent })
    });
    loadData();
  };

  const handleApproveRequest = async (id) => {
    await fetch(`http://localhost:5000/api/admin/unblock/${id}`, {
      method: "PUT",
      credentials: "include"
    });
    loadData();
  };

  /* ANALYTICS DATA */
  const tasksPerDay = Object.values(
    tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!acc[date]) acc[date] = { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  ).slice(-14); // Last 14 days

  let cumulative = 0;
  const growthTrend = tasksPerDay.map(item => {
    cumulative += item.count;
    return { ...item, total: cumulative };
  });

  const statusData = Object.values(
    tasks.reduce((acc, task) => {
      const status = task.status;
      if (!acc[status]) acc[status] = { name: status.charAt(0).toUpperCase() + status.slice(1), value: 0 };
      acc[status].value += 1;
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white"><LayoutDashboard className="w-6 h-6"/></div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground border-none m-0 shadow-none tracking-tight">System Control</h1>
                    <p className="text-muted-foreground">Platform health and user management</p>
                </div>
            </div>
            <Link to="/admin-complaints" className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 px-6 py-2.5 rounded-xl font-semibold transition-all">
                <ShieldAlert className="w-5 h-5"/> View Complaints
            </Link>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 border-none relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Users className="w-24 h-24"/></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Users className="w-7 h-7"/></div>
                <div><p className="text-sm font-medium text-muted-foreground">Total Users</p><h3 className="text-3xl font-bold text-foreground">{stats.totalUsers || userTotal}</h3></div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 border-none relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Target className="w-24 h-24"/></div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Target className="w-7 h-7"/></div>
                <div><p className="text-sm font-medium text-muted-foreground">Total Tasks</p><h3 className="text-3xl font-bold text-foreground">{stats.totalTasks || tasks.length}</h3></div>
            </div>
            <div className="glass-card rounded-2xl p-6 flex items-center gap-4 border-none relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5"><Lock className="w-24 h-24"/></div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Lock className="w-7 h-7"/></div>
                <div><p className="text-sm font-medium text-muted-foreground">Blocked Users</p><h3 className="text-3xl font-bold text-foreground">{stats.blockedUsers || 0}</h3></div>
            </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="glass-card rounded-3xl p-6 border-none">
                <h3 className="text-lg font-bold text-foreground mb-6 shadow-none border-none">Task Volume (Last 14 Days)</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tasksPerDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                            <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} />
                            <Bar dataKey="count" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border-none">
                <h3 className="text-lg font-bold text-foreground mb-6 shadow-none border-none">Task Status Distribution</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* USERS TABLE */}
        <div className="glass-card rounded-[2rem] border-none overflow-hidden mt-8">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-secondary/30">
                <h2 className="text-xl font-bold text-foreground shadow-none border-none m-0">User Directory</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary bg-opacity-50">
                            <th className="p-4 font-semibold text-muted-foreground text-sm">User</th>
                            <th className="p-4 font-semibold text-muted-foreground text-sm">Status</th>
                            <th className="p-4 font-semibold text-muted-foreground text-sm">Ban Info / Requests</th>
                            <th className="p-4 font-semibold text-muted-foreground text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className={`border-b border-white/5 transition-colors ${user.unblockRequested ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-secondary/30'}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${user.role === 'client' ? 'bg-blue-500/10 text-blue-500' : user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.isBlocked ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {user.isBlocked && (
                                        <div className="text-sm">
                                            {user.banReason && <p className="text-muted-foreground"><span className="text-foreground">Reason:</span> {user.banReason}</p>}
                                            {user.isPermanentlyBlocked ? (
                                                <p className="text-destructive font-medium text-xs mt-1">Permanent Ban</p>
                                            ) : user.banUntil ? (
                                                <p className="text-amber-500 text-xs mt-1">Free on: {new Date(user.banUntil).toLocaleDateString()}</p>
                                            ) : null}
                                        </div>
                                    )}
                                    {user.unblockRequested && (
                                        <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 max-w-xs">
                                            <p className="text-amber-500 font-bold text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Review Request</p>
                                            <p className="text-muted-foreground text-xs italic mt-1 line-clamp-2">"{user.unblockMessage}"</p>
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {!user.isBlocked && user.role !== "admin" && (
                                            <>
                                                <button onClick={() => handleBan(user._id, false)} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-500 rounded-lg text-xs font-semibold transition-colors">Temp Ban</button>
                                                <button onClick={() => handleBan(user._id, true)} className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive rounded-lg text-xs font-semibold transition-colors border-none">Perm Ban</button>
                                            </>
                                        )}
                                        {user.isBlocked && !user.unblockRequested && (
                                            <button onClick={() => handleUnblock(user._id)} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"><Unlock className="w-3 h-3"/> Unblock</button>
                                        )}
                                        {user.unblockRequested && (
                                            <button onClick={() => handleApproveRequest(user._id)} className="px-3 py-1.5 brand-gradient hover:opacity-90 text-white rounded-lg text-xs font-semibold transition-all shadow-md">Approve Unblock</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 border-t border-white/5">
                <Pagination page={userPage} totalPages={userTotalPages} total={userTotal} limit={userLimit} setPage={setUserPage} setLimit={setUserLimit} />
            </div>
        </div>

      </div>
    </div>
  );
}