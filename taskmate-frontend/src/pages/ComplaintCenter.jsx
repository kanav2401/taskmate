import { useState } from "react";
import { AlertCircle, CheckCircle2, MessageSquare, Send } from "lucide-react";

export default function ComplaintCenter() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a proper explanation.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("http://localhost:5000/api/users/request-unblock", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Account review request submitted successfully. You will now be redirected to login...");
      setMessage("");

      // 🔥 Auto logout after complaint submission
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-4 flex items-start justify-center">
      <div className="w-full max-w-xl glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden border-none shadow-2xl">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-3 border-none shadow-none m-0">Account Support</h1>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                If you believe your account was blocked unfairly or by mistake, please submit a detailed explanation below for our moderation team to review.
            </p>
        </div>

        <div className="relative z-10">
            {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-sm">Request Submitted</h4>
                        <p className="text-sm opacity-90">{success}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" /> Detail Your Situation
                    </label>
                    <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please explain why your account should be unblocked. Include any relevant task context..."
                    required
                    disabled={success || loading}
                    rows={6}
                    className="w-full bg-secondary/50 border border-border text-foreground rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y disabled:opacity-50"
                    />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || success}
                  className="w-full brand-gradient text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
                >
                {loading ? (
                    <span className="flex items-center gap-2">Submitting Request <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/></span>
                ) : (
                    <>Submit Request <Send className="w-4 h-4"/></>
                )}
                </button>
            </form>
        </div>

      </div>
    </div>
  );
}
