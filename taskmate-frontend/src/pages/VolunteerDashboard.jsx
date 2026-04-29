import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVolunteerTasks,
  submitTask,
  requestUnblock,
  submitComplaint,
  API_URL,
} from "../api/api";
import Pagination from "../components/Pagination";
import { Wallet, Star, AlertCircle, FileText, CheckCircle, Target, ArrowRight } from "lucide-react";

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [page, limit]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerTasks(page, limit);
      if (data?.data) {
        setTasks(data.data);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id) => {
    if (user?.isBlocked) {
      alert("You are currently blocked and cannot submit tasks.");
      return;
    }
    const note = prompt("Add submission note (optional):");
    try {
        await submitTask(id, note);
        loadTasks();
    } catch(err) { console.error(err); }
  };

  const handleRequestUnblock = async () => {
    try {
        const res = await requestUnblock();
        alert(res.message);
        fetchUser(); // Refresh user status
    } catch(err) { console.error(err); }
  };

  const handleComplaint = async (taskId) => {
    const message = prompt("Enter your complaint regarding this client/task:");
    if (!message) return;
    try {
        const res = await submitComplaint(taskId, message);
        alert(res.message);
    } catch(err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'submitted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROFILE IDENTIFIER */}
        <div className="glass-card rounded-3xl p-8 border-none relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl brand-gradient flex items-center justify-center text-white text-3xl font-bold uppercase shadow-xl">
                {user?.name?.charAt(0) || 'V'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground border-none">Welcome back, {user?.name?.split(' ')[0]}</h1>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Volunteer</span>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500"/> {user?.averageRating?.toFixed(1) || "0.0"} Rating</div>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <div>{user?.totalRatings || 0} Reviews</div>
                </div>
              </div>
            </div>

            <Link to="/wallet" className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary border border-border px-6 py-3 rounded-xl font-semibold text-foreground transition-all">
              <Wallet className="w-5 h-5 text-primary" /> My Wallet <ArrowRight className="w-4 h-4 opacity-50" />
            </Link>
          </div>
        </div>

        {/* ALERTS */}
        {user?.isPermanentlyBlocked ? (
           <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-destructive border-none mb-1">Account Permanently Banned</h3>
                <p className="text-destructive/80">You have crossed the 3-strike limit due to repeated violations. You can no longer interact with tasks. Contact support if you believe this is an error.</p>
              </div>
           </div>
        ) : user?.isBlocked ? (
           <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-amber-500 border-none mb-1">Account Temporarily Blocked</h3>
                  <p className="text-amber-500/80">You missed a deadline or violated a policy. You cannot submit current tasks.</p>
                </div>
              </div>
              <button onClick={handleRequestUnblock} className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
                Request Unblock
              </button>
           </div>
        ) : null}

        {/* ACTIVE TASKS */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border-none space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-foreground border-none">My Accepted Tasks</h2>
            <Link to="/browse" className="text-sm font-medium text-primary hover:underline">Find more tasks &rarr;</Link>
          </div>

          {loading ? (
             <div className="py-20 flex justify-center items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-primary opacity-50" />
              </div>
              <p className="text-lg font-medium text-foreground">No active tasks</p>
              <p className="text-muted-foreground mb-6">You haven't accepted any tasks yet, or they are all completed.</p>
              <Link to="/browse" className="brand-gradient text-white px-6 py-2.5 rounded-xl font-medium inline-flex items-center gap-2">
                Browse Available Tasks <Target className="w-4 h-4"/>
              </Link>
            </div>
          ) : (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <div key={task._id} className="group bg-secondary/30 border border-white/5 hover:border-primary/20 hover:bg-white/5 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full">
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-lg font-bold text-foreground">₹{task.budget}</span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 border-none">{task.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{task.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium bg-background/50 rounded-lg p-3 mb-4">
                    <div className="text-muted-foreground">Client: <span className="text-foreground">{task.client?.name}</span></div>
                    <div className="text-muted-foreground">Deadline: <span className="text-foreground">{new Date(task.deadline).toLocaleDateString()}</span></div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <Link to={`/task/${task._id}`} className="w-full py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-xl text-sm font-semibold flex items-center justify-center transition-colors">
                      View full details
                    </Link>

                    {task.status === "accepted" && !user?.isBlocked && !user?.isPermanentlyBlocked && (
                      <button onClick={() => handleSubmit(task._id)} className="w-full py-2 brand-gradient text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all">
                        <CheckCircle className="w-4 h-4"/> Submit Finished Work
                      </button>
                    )}

                    {!user?.isPermanentlyBlocked && (
                        <button onClick={() => handleComplaint(task._id)} className="w-full py-2 text-destructive hover:bg-destructive/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            <AlertCircle className="w-4 h-4"/> File Complaint
                        </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && total > 0 && (
            <div className="pt-6 border-t border-white/5">
              <Pagination page={page} totalPages={totalPages} total={total} limit={limit} setPage={setPage} setLimit={setLimit} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}