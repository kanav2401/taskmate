import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getClientTasks,
  completeTask,
  rateTask,
  fundTask,
  submitComplaint
} from "../api/api";
import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import ChatPanel from "../components/ChatPanel";
import { Plus, CheckCircle, CreditCard, AlertTriangle, MessageSquare, Star, Clock, User, Target } from "lucide-react";

export default function ClientDashboard() {
  const [tasks, setTasks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { loadTasks(); }, [page, limit]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getClientTasks(page, limit);
      if (data?.data) {
        setTasks(data.data);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (taskId) => {
    if (!window.confirm("Mark this task as completed?")) return;
    try {
      const res = await completeTask(taskId);
      if (res?.message) loadTasks();
    } catch (err) { console.error("Complete failed"); }
  };

  const handleFund = async (id) => {
    try {
      const res = await fundTask(id);
      alert(res.message);
      loadTasks();
    } catch (err) { console.error(err); }
  };

  const handleRatingSubmit = async (taskId) => {
    const rating = ratings[taskId];
    const review = reviews[taskId] || "";
    if (!rating) { alert("Please select rating"); return; }
    try {
      const res = await rateTask(taskId, rating, review);
      if (res?.message) {
        alert("Rating submitted successfully!");
        loadTasks();
      }
    } catch (err) { console.error("Rating failed"); }
  };

  const handleComplaint = async (taskId) => {
    const message = prompt("Describe the issue with the volunteer:");
    if (!message) return;
    try {
      const res = await submitComplaint(taskId, message);
      alert(res.message || "Complaint submitted");
    } catch(err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'accepted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'submitted': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Client Workspace</h1>
            <p className="text-muted-foreground mt-1">Manage your posted tasks and track volunteer progress.</p>
          </div>
          <Link to="/post-task" className="brand-gradient text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
            <Plus className="w-5 h-5" /> Post New Task
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-none">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Target className="w-6 h-6"/></div>
             <div><p className="text-sm font-medium text-muted-foreground">Total Tasks</p><h3 className="text-2xl font-bold text-foreground">{total}</h3></div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-none">
             <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><CheckCircle className="w-6 h-6"/></div>
             <div><p className="text-sm font-medium text-muted-foreground">Completed</p><h3 className="text-2xl font-bold text-foreground">{tasks.filter(t => t.status === 'completed').length}</h3></div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-none">
             <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-6 h-6"/></div>
             <div><p className="text-sm font-medium text-muted-foreground">Active Tasks</p><h3 className="text-2xl font-bold text-foreground">{tasks.filter(t => t.status === 'accepted' || t.status === 'submitted').length}</h3></div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:p-8 border-none space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-foreground border-none">Your Tasks</h2>
          </div>

          {loading ? (
             <div className="py-20 flex justify-center items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Target className="w-10 h-10 text-primary opacity-50" />
              </div>
              <p className="text-lg font-medium text-foreground">No tasks found</p>
              <p className="text-muted-foreground">You haven't posted any tasks yet.</p>
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
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">{task.description}</p>

                  {task.volunteer && (
                    <div className="bg-background/50 rounded-xl p-3 mb-4 border border-white/5">
                      <div className="flex items-center justify-between p-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase px-2 py-0 border-none m-0 shadow-none">
                            {task.volunteer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.volunteer.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {task.volunteer.averageRating?.toFixed(1) || "0.0"} ({task.volunteer.totalRatings || 0})
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setActiveChat(task._id)} className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Chat">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-4 space-y-2 border-t border-white/5">
                    {task.paymentStatus === "pending" && task.status === "open" && (
                      <button onClick={() => handleFund(task._id)} className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <CreditCard className="w-4 h-4"/> Fund Task
                      </button>
                    )}

                    {task.status === "submitted" && (
                      <button onClick={() => handleComplete(task._id)} className="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                        <CheckCircle className="w-4 h-4"/> Accept & Complete
                      </button>
                    )}

                    {task.volunteer && task.status !== "completed" && task.status !== "open" && (
                      <button onClick={() => handleComplaint(task._id)} className="w-full py-2 text-destructive hover:bg-destructive/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <AlertTriangle className="w-4 h-4"/> Report Issue
                      </button>
                    )}

                    {task.status === "completed" && !task.rating && (
                      <div className="space-y-3 bg-secondary/50 rounded-xl p-3 border border-border">
                        <p className="text-xs font-semibold text-foreground text-center">Rate Volunteer</p>
                        <div className="flex justify-center"><StarRating value={ratings[task._id] || 0} onChange={(val) => setRatings(prev => ({...prev, [task._id]: val}))}/></div>
                        <input type="text" placeholder="Write a review..." value={reviews[task._id] || ""} onChange={(e) => setReviews(prev => ({...prev, [task._id]: e.target.value}))} className="w-full text-sm bg-background border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"/>
                        <button onClick={() => handleRatingSubmit(task._id)} className="w-full py-1.5 brand-gradient text-white rounded-lg text-xs font-semibold">Submit Feedback</button>
                      </div>
                    )}

                    {task.rating && (
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground w-full py-2 bg-background/50 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-green-500"/> Rated {task.rating}/5
                      </div>
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

      {/* CHAT OVERLAY */}
      {activeChat && (
        <ChatPanel taskId={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </div>
  );
}
