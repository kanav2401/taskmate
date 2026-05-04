import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { API_URL } from "../api/api";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess(data.message || "Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground border-none">Contact Our Team</h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            Have questions about TaskMate? Want to report an issue or suggest a feature? We're here to help you get the most out of your experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mail className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground relative z-10 border-none">Contact Information</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Email Support</p>
                    <a href="mailto:sharmakanav53@gmail.com" className="text-lg text-foreground hover:text-primary transition-colors">sharmakanav53@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Phone (Emergencies)</p>
                    <p className="text-lg text-foreground">7814752729</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Office Location</p>
                    <p className="text-lg text-foreground">Phase 8A<br/>Mohali, Punjab</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-foreground border-none">Send a Message</h3>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Message Sent!</h4>
                  <p className="text-sm opacity-90">{success}</p>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea 
                  rows="5"
                  placeholder="How can we help you?" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none disabled:opacity-50"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full brand-gradient text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    Sending... <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
