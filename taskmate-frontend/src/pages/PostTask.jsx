import { useState } from "react";
import { postTask, API_URL } from "../api/api";
import { Sparkles, Calendar, DollarSign, FileText, Type, CheckCircle2, ArrowRight } from "lucide-react";

export default function PostTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ===============================
     AI DESCRIPTION IMPROVER
  =============================== */
  const improveWithAI = async () => {
    if (!form.description.trim()) {
      setError("Please write a draft description first before using AI.");
      setMessage("");
      return;
    }

    try {
      setAiLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_URL}/ai/improve-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ description: form.description })
      });

      if (!res.ok) throw new Error("AI request failed");

      const data = await res.json();
      if (data?.improved) {
        setForm(prev => ({ ...prev, description: data.improved }));
        setMessage("Description enhanced successfully!");
      } else {
        setError("AI could not improve description.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setError("AI failed to improve description. Try again later.");
    } finally {
      setAiLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  /* ===============================
     POST TASK
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError("");
    setMessage("");

    try {
      const res = await postTask(form);
      setMessage(res.message || "Task posted successfully!");
      setForm({ title: "", description: "", budget: "", deadline: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to post task. Please ensuring all fields are correctly formatted.");
    } finally {
      setPosting(false);
      setTimeout(() => { setMessage(""); setError(""); }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4 relative z-10 border-none shadow-none">
            Post a New <span className="brand-text-gradient">Task</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto relative z-10">
            Describe what you need done, set a budget, and let talented volunteers handle the rest.
          </p>
        </div>

        <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden border-none shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          {(message || error) && (
            <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 border ${message ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{message || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            
            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                 <Type className="w-4 h-4 text-primary" /> Task Title
              </label>
              <input
                name="title"
                placeholder="e.g., Build a responsive React landing page"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                     <FileText className="w-4 h-4 text-primary" /> Description
                  </label>
                  <button
                    type="button"
                    onClick={improveWithAI}
                    disabled={aiLoading}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading ? "Enhancing..." : "Improve with AI"}
                  </button>
              </div>
              <textarea
                name="description"
                placeholder="Provide details about the project, requirements, and deliverables..."
                value={form.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
              />
            </div>

            {/* BUDGET & DEADLINE ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                   <DollarSign className="w-4 h-4 text-primary" /> Budget (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    name="budget"
                    type="number"
                    min="1"
                    placeholder="5000"
                    value={form.budget}
                    onChange={handleChange}
                    required
                    className="w-full bg-secondary/50 border border-border text-foreground rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-primary" /> Deadline
                </label>
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-secondary/50 border border-border text-foreground rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="pt-4">
                <button
                type="submit"
                disabled={posting}
                className="w-full brand-gradient text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                {posting ? (
                    <span className="flex items-center gap-2">Processing <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/></span>
                ) : (
                    <>Publish Task <ArrowRight className="w-5 h-5"/></>
                )}
                </button>
                <p className="text-xs text-center text-muted-foreground mt-4">By posting, you agree to place the required funds into escrow.</p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}