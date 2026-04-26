import { useEffect, useState } from "react";
import { getOpenTasks, acceptTask } from "../api/api";
import { getUser } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { Search, Briefcase, Clock, IndianRupee, MapPin, Target, CheckCircle, ArrowRight } from "lucide-react";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "volunteer") {
      setError("Only verified volunteers can browse and accept tasks.");
      setLoading(false);
      return;
    }
    loadTasks();
  }, [page, limit]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getOpenTasks(page, limit);
      if (data?.data) {
        setTasks(data.data);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || "Failed to load tasks");
      }
    } catch (err) {
      setError("Server error while fetching tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this task? You will be held to its deadline.")) return;
    try {
        const res = await acceptTask(id);
        if (res.message) {
            alert(res.message);
            loadTasks();
            navigate('/volunteer-dashboard');
        }
    } catch(err) { console.error(err); }
  };

  if (error) {
    return (
        <div className="min-h-screen pt-32 pb-12 bg-background flex flex-col items-center justify-center p-4">
            <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center border-destructive/20">
                <div className="w-16 h-16 mx-auto bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
                <p className="text-muted-foreground">{error}</p>
                <Link to="/" className="mt-8 inline-block brand-gradient text-white px-6 py-2.5 rounded-xl font-medium">Return Home</Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER SECTION */}
      <div className="relative mb-12 py-12 px-6 lg:px-12 rounded-[2rem] overflow-hidden border border-white/5 bg-secondary/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 z-0" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 border-none">
            Find Your Next <span className="brand-text-gradient">Opportunity</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Browse through hundreds of open tasks posted by peers. Filter by category, budget, and pick tasks that match your skills.
          </p>
          
          <div className="flex bg-background border border-border rounded-xl px-4 py-2 items-center shadow-sm max-w-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search tasks by keyword..." 
              className="w-full bg-transparent border-none focus:outline-none px-4 py-2 text-foreground"
            />
            <button className="whitespace-nowrap brand-gradient text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* FILTERS & STATS */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-background/50 border border-white/5 backdrop-blur-md rounded-2xl p-4 sticky top-20 z-20 shadow-sm">
            <div className="text-muted-foreground font-medium mb-4 sm:mb-0">
                Found <strong className="text-foreground">{total}</strong> open tasks
            </div>
            <div className="flex gap-2">
                <select className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-10">
                    <option>All Categories</option>
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Writing</option>
                </select>
                <select className="bg-secondary border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-10">
                    <option>Default Sort</option>
                    <option>Highest Budget</option>
                    <option>Urgent Deadline</option>
                </select>
            </div>
        </div>

        {/* TASKS GRID */}
        {loading ? (
             <div className="py-20 flex justify-center items-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
        ) : tasks.length === 0 ? (
            <div className="text-center py-32 glass-card rounded-3xl border-none">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 shadow-none border-none">No Tasks Found</h3>
                <p className="text-muted-foreground">Check back later or try adjusting your search filters.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map(task => (
                <div key={task._id} className="group glass-card rounded-3xl p-6 lg:p-8 flex flex-col h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-white/5">
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                         {task.client?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{task.client?.name}</p>
                        <p className="text-xs text-muted-foreground">Verified Client</p>
                      </div>
                    </div>
                    <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Open</span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 leading-snug shadow-none border-none group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/task/${task._id}`)}>
                    {task.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
                    {task.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        <span className="font-bold">{task.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 grid grid-cols-2 gap-3 mt-auto">
                    <button onClick={() => navigate(`/task/${task._id}`)} className="py-2.5 bg-secondary hover:bg-white/10 border border-border text-foreground font-semibold rounded-xl text-sm transition-colors text-center">
                        Details
                    </button>
                    <button onClick={() => handleAccept(task._id)} className="py-2.5 brand-gradient text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all">
                        Accept <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
        )}

        {/* PAGINATION */}
        {!loading && total > 0 && (
          <div className="pt-8">
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} setPage={setPage} setLimit={setLimit} />
          </div>
        )}

      </div>
    </div>
  );
}