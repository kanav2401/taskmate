import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getTaskById, API_URL } from "../api/api";
import Chat from "../components/Chat";
import { ArrowLeft, MessageSquare, Clock, IndianRupee, FileText, User, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    loadTask();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const loadTask = async () => {
    setLoading(true);
    try {
      const data = await getTaskById(id);
      if (data?.message) setError(data.message);
      else setTask(data);
    } catch {
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  if (error) return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center p-4">
          <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center border-destructive/20">
              <h2 className="text-2xl font-bold text-foreground mb-2 shadow-none border-none">Task Not Found</h2>
              <p className="text-muted-foreground">{error}</p>
              <button onClick={() => navigate(-1)} className="mt-8 brand-gradient text-white px-6 py-2.5 rounded-xl font-medium">Go Back</button>
          </div>
      </div>
  );

  if (loading || !task || !user) return (
      <div className="min-h-screen pt-32 pb-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
  );

  const isClient = task.client?.id === user.id;
  const isVolunteer = task.volunteer?.id === user.id;
  const isAdmin = user.role === "admin";
  const isTaskActive = ["accepted", "submitted", "completed"].includes(task.status);
  const canChat = task.volunteer && isTaskActive && (isClient || isVolunteer || isAdmin);

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
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group border-none bg-transparent">
           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-3xl p-8 lg:p-10 border-none relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-5 pointer-events-none"><FileText className="w-48 h-48"/></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Clock className="w-4 h-4"/> Posted {new Date(task.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 shadow-none border-none relative z-10">
                        {task.title}
                    </h1>

                    <div className="prose prose-invert max-w-none mb-10 relative z-10">
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-lg">
                            {task.description}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 border-t border-white/5 pt-8 relative z-10">
                        <div className="bg-secondary/30 rounded-2xl p-5 border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><IndianRupee className="w-6 h-6"/></div>
                            <div><p className="text-sm text-muted-foreground">Task Budget</p><p className="text-2xl font-bold text-foreground">₹{task.budget}</p></div>
                        </div>
                        <div className="bg-secondary/30 rounded-2xl p-5 border border-white/5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-6 h-6"/></div>
                            <div><p className="text-sm text-muted-foreground">Deadline specified</p><p className="text-xl font-bold text-foreground">{new Date(task.deadline).toLocaleDateString()}</p></div>
                        </div>
                    </div>
                </div>

                {task.paymentStatus && (
                    <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                           <h3 className="text-lg font-bold text-green-500 border-none shadow-none m-0">Payment {task.paymentStatus}</h3>
                           <p className="text-sm text-muted-foreground">The transaction is secured by TaskMate escrow system.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">

                <div className="glass-card rounded-3xl p-6 border-none">
                    <h3 className="text-lg font-bold text-foreground mb-4 border-b border-white/5 pb-2 shadow-none">Client Overview</h3>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl uppercase">
                            {task.client?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-lg">{task.client?.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> ID Verified</p>
                        </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="w-4 h-4"/> {task.client?.email || 'Email hidden'}</div>
                    </div>
                </div>

                {task.volunteer && (
                    <div className="glass-card rounded-3xl p-6 border-none">
                        <h3 className="text-lg font-bold text-foreground mb-4 border-b border-white/5 pb-2 shadow-none">Assigned Volunteer</h3>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-2xl uppercase">
                                {task.volunteer?.name?.charAt(0) || 'V'}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground text-lg">{task.volunteer?.name}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> Trusted Member</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="w-4 h-4"/> {task.volunteer?.email || 'Email hidden'}</div>
                        </div>
                    </div>
                )}

                {canChat && (
                    <button 
                        onClick={() => setShowChat(true)}
                        className="w-full py-4 brand-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all"
                    >
                        <MessageSquare className="w-5 h-5"/> Open Workspace Chat
                    </button>
                )}

            </div>
        </div>

      </div>

      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm mt-16">
            <div className="w-full max-w-2xl bg-secondary/90 border border-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-background px-6 py-4 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><MessageSquare className="w-5 h-5"/></div>
                        <div>
                            <h3 className="font-bold text-foreground border-none m-0 shadow-none">Project Workspace</h3>
                            <p className="text-xs text-muted-foreground">End-to-end encrypted chat</p>
                        </div>
                    </div>
                    <button onClick={() => setShowChat(false)} className="bg-secondary hover:bg-white/10 p-2 rounded-full transition-colors border-none text-muted-foreground text-2xl leading-none">
                        &times;
                    </button>
                </div>
                <div className="h-[60vh] max-h-[800px] w-full p-0">
                    <Chat taskId={task._id} user={user} onClose={() => setShowChat(false)} />
                </div>
            </div>
        </div>
      )}

    </div>
  );
}
